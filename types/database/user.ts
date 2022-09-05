export interface ICreateUserProps {
  email: string;
  password: string;
  admin: boolean;
}

export interface IValidateUserResponse {
  valid: boolean;
}
