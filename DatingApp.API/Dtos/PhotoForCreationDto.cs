using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{ // 104
    public class PhotoForCreationDto
    {
        public string Url { get; set; }

        // Microsoft.AspNetCore.Http
        public IFormFile File  { get; set; }
        public string  Description { get; set; }
        public DateTime DateAdded { get; set; }

        // this is what were goign to get back from cloudinary
        public string PublicId { get; set; }
        // add a contructor so that we can add dateAdded
        public PhotoForCreationDto()
        {
            DateAdded = DateTime.Now;
        }

    }
}