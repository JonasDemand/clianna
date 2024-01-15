namespace Data.Models.Misc;

public class GoogleOptions
{
    public string RootFolderId { get; set; }

    public string? DEV_ServiceAccountJson { get; set; }
    public GoogleServiceAccountCredentials? ServiceAccountCredentials { get; set; }

    public class GoogleServiceAccountCredentials
    {
        public string type { get; set; }
        public string universe_domain { get; set; }
        public string project_id { get; set; }
        public string private_key_id { get; set; }
        public string private_key { get; set; }
        public string client_email { get; set; }
        public string client_id { get; set; }
        public string auth_uri { get; set; }
        public string token_uri { get; set; }
        public string auth_provider_x509_cert_url { get; set; }
        public string client_x509_cert_url { get; set; }
    }
}

public class AppSettings
{
    public string Secret { get; set; }
    public string DbConnection { get; set; }

    public GoogleOptions GoogleOptions { get; set; }
    public bool DevMode { get; set; }
}