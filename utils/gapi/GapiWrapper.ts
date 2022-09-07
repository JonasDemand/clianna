import { OAuth2Client } from 'google-auth-library';
import { docs_v1, drive_v3, google } from 'googleapis';

export class GapiWrapper {
  private oauth2Client: OAuth2Client;
  public docs: docs_v1.Docs;
  public drive: drive_v3.Drive;

  constructor(refreshToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    );
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    this.docs = google.docs({
      version: 'v1',
      auth: this.oauth2Client,
    });
    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }
}
