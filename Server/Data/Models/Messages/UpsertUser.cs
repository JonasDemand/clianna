namespace Data.Models.Messages
{
	public class UpsertUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Enabled { get; set; }
    }
}

