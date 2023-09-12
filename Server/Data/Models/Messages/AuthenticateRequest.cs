using System.ComponentModel.DataAnnotations;

namespace Data.Models.Messages
{
	public class AuthenticateRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}

