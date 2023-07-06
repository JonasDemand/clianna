## Getting Started

TODO

## .env example

\# Next-Auth
NEXTAUTH_URL=http://localhost:3000
SECRET=cyutB9kUcMcxtgdywOmwPu3gybEjTzlhWqcaRj4BWeA=

\# Google Service Account
GOOGLE_SERVICEACCOUNT_PROJECT_ID=your-project-id
GOOGLE_SERVICEACCOUNT_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_SERVICEACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICEACCOUNT_CLIENT_EMAIL=your-service-account-email
GOOGLE_SERVICEACCOUNT_CLIENT_ID=your-client-id
GOOGLE_SERVICEACCOUNT_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_SERVICEACCOUNT_TOKEN_URI=https://accounts.google.com/o/oauth2/token
GOOGLE_SERVICEACCOUNT_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_SERVICEACCOUNT_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email

\# Google Drive
GOOGLE_DRIVE_ROOT_FOLDER=\*\*\*

\# DBs
DATABASE_URL=mysql://root:@localhost:3306/clianna?connection_limit=1&pool_timeout=0

DATABASE_URL_DEV=\*\*\*

DATABASE_URL_PROD=\*\*\*
