import { environment } from '@utils/config';
import { docs_v1, drive_v3, google } from 'googleapis';

const credentials = {
  type: 'service_account',
  universe_domain: 'googleapis.com',
  project_id: environment.GOOGLE_SERVICEACCOUNT_PROJECT_ID,
  private_key_id: environment.GOOGLE_SERVICEACCOUNT_PRIVATE_KEY_ID,
  private_key: environment.GOOGLE_SERVICEACCOUNT_PRIVATE_KEY,
  client_email: environment.GOOGLE_SERVICEACCOUNT_CLIENT_EMAIL,
  client_id: environment.GOOGLE_SERVICEACCOUNT_CLIENT_ID,
  auth_uri: environment.GOOGLE_SERVICEACCOUNT_AUTH_URI,
  token_uri: environment.GOOGLE_SERVICEACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url:
    environment.GOOGLE_SERVICEACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: environment.GOOGLE_SERVICEACCOUNT_CLIENT_X509_CERT_URL,
};

export class GapiWrapper {
  public static Instance: GapiWrapper;
  public docs: docs_v1.Docs;
  public drive: drive_v3.Drive;

  constructor() {
    this.docs = google.docs({
      version: 'v1',
    });
    this.drive = google.drive({
      version: 'v3',
    });
  }

  public async Init() {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    this.docs = google.docs({
      version: 'v1',
      auth,
    });
    this.drive = google.drive({
      version: 'v3',
      auth,
    });
  }
}

GapiWrapper.Instance = new GapiWrapper();
GapiWrapper.Instance.Init();
