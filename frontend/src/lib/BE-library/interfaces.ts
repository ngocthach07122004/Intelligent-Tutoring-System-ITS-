export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}
