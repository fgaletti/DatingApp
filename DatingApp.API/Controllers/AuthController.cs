using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IMapper _mapper; // 114 inizialice 

        public IConfiguration _config { get; }

        //injects repository into this, para eso se crea el constructor        
        public AuthController(IAuthRepository repo, IConfiguration config,
            IMapper  mapper) // 114 add mapper 
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;  // 114 add mapper 
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto  userForRegisterDto)
       // public async Task<IActionResult> Register([FromBody]UserForRegisterDto  userForRegisterDto)

        {

            //FromBody  :  Transforma los datos null en espacios en blanco

            //validate request
            //if [ApiController] is present we dont need this code:
            //if (!ModelState.IsValid)
            // return BadRequest(ModelState);

            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();
            if (await _repo.UserExists(userForRegisterDto.UserName))
                return BadRequest("user already exists");

            /* deleted in 128 
            
            var userToCreate = new User
            {
                UserName = userForRegisterDto.UserName
            };*/
            // 128 now we use mapper
             var userToCreate = _mapper.Map<User>(userForRegisterDto);
           
            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            // 128 return ANOTHER USER-CLASS a DTO that does not contain the password    
             var userToReturn = _mapper.Map<UserForDetailsDto>(createdUser);

            // ELIMINADO EN 128 return StatusCode(201);
            return CreatedAtRoute("GetUser", new {controller = "Users", id = createdUser.Id}, userToReturn);
            // NAME of the route 
        }

       [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto  userForLoginDto)
        {

               // throw new Exception("computer sauss no@");

                var userFromRepo = await _repo.Login(userForLoginDto.UserName.ToLower(), userForLoginDto.Password);

                if (userFromRepo == null)
                    return Unauthorized();

                //create token
                var claims = new[]
                {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),  
                new Claim(ClaimTypes.Name, userFromRepo.UserName)
                };

                // add tokens
                //config.GetSection("Appsettings:Token") => appsettings.json
                var key  = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Appsettings:Token").Value));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };
                                    
                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateToken(tokenDescriptor);
                
                // 114  we dont want to use userFromRepo becase has passwords so
                // we use UserForListDto better
                var user = _mapper.Map<UserForListDto>(userFromRepo);
                //var user = _mapper.Map<UserForListDto>(_repo.GetUser(userFromRepo.Id);
                // var user = await _repo.GetUser(id);

                return Ok(
                    new { token =  tokenHandler.WriteToken(token), 
                        user // 114 add new parameter
                    }
                );
           
           /* 
            {
                return StatusCode(500, "Computer reallys says no!");
            }*/


        }


    }
}