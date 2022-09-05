export interface ICreateUserRequest {
  email: string;
  password: string;
}

export interface IValidateUserResponse {
  valid: boolean;
}
