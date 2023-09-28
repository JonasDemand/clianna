namespace Data.Models.Messages;

public class UpdateProfileRequest : UpsertUserRequest
{
    public string OldPassword { get; set; }
}