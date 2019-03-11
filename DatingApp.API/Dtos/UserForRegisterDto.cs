using System;
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
        // 128 ADD FIELDS 
        [Required]
        public string Gender { get; set; }
         [Required]
        public string  KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
         [Required]
        public string  City { get; set; }
         [Required]
        public string  Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        public UserForRegisterDto()
        {
            Created =DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}