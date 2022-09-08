export interface IUpsertCredentialsRequest {
  email: string;
  password: string;
}

export interface IValidateUserResponse {
  valid: boolean;
}
