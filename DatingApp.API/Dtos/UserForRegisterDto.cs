using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }    
        [Required]
        [StringLength(8, MinimumLength=4, ErrorMessage="you myst spacify password betttween 4 and 8 characteres")]
        public string Password { get; set; }    
    }
}