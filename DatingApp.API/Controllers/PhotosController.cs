using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet; // 104
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper,
        IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this._cloudinaryConfig = cloudinaryConfig;
            this._mapper = mapper;
            this._repo = repo;
            // using CloudinaryDotNet 104
            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            //  generate a new variable 
            _cloudinary = new Cloudinary(acc);            
        }

    

        // 105  Root with a name
        [HttpGet("{id}", Name = "GetPhoto")] 
        public async Task<IActionResult> GetPhoto(int id)
        {
           var photoFromRepo = await _repo.GetPhoto(id);     

           var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

           return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser ( int userId,
            [FromForm]PhotoForCreationDto photoForCreationDto)
            {

             //check that the user that is attempting to update the profile matches
             // the token that the server is receiveing 
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();

            var userFromRepo = await _repo.GetUser(userId); 

            var file = photoForCreationDto.File;

            // CloudinaryDotNet.Actions
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                         //transform the image , long photo 
                         File = new FileDescription(file.Name, stream),
                         Transformation = new Transformation()
                         .Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);


            // if this return false that means that the user doesnt have a main photo
            if (!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;

           userFromRepo.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);

                // it should be return CreatedAtRoute
                // return Ok();
                 return CreatedAtRoute("GetPhoto", new { id = photo.Id}, photoToReturn); // 201
            }    

            return BadRequest("Could not add the photo");
        }

        // photoId = int photoId
       [HttpPost("{photoId}/SetMainPhoto")]

        // 110
       public async Task<IActionResult> SetMainPhoto(int userId, int photoId) 
       {
            //check that the user that is attempting to update the profile matches
             // the token that the server is receiveing 
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(photoId);

            if (photoFromRepo.IsMain)
                return BadRequest("This is already Main Photo");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await _repo.SaveAll())
               return NoContent();

            return BadRequest("Could not set photp to main");   
       }

       [HttpDelete("{photoId}")]
        //  "{photoId}" ==>  int photoId ==> DeletePhoto (int userId, int photoId))
        public async Task<IActionResult> DeletePhoto (int userId, int photoId)
        {
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();

            var user = await _repo.GetUser(userId); 

            if (!user.Photos.Any(p => p.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(photoId);

            if (photoFromRepo.IsMain)
                return BadRequest("You cannot delete your main photo");

            // if photo is in cloudinary
            if (photoFromRepo.PublicId != null)
            {
                 // delete from cloudinary
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                // take deletion params
                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    _repo.Delete(photoFromRepo);
                }
            }
            else // photoFromRepo.PublicId == null
            {
                _repo.Delete(photoFromRepo);
            }
           

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the photo");    

        }

    }
}