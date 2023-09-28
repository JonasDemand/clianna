using Data.Models.Enums;

namespace Data.Models.Messages;

public class UpsertCustomerRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Street { get; set; }
    public string? StreetNumber { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public string? Phone { get; set; }
    public string? Mobile { get; set; }
    public bool? WhatsApp { get; set; }
    public float? ShoeSize { get; set; }
    public bool? Disabled { get; set; }
    public string? Comment { get; set; }
    public ECustomerSalutation? Salutation { get; set; }
}