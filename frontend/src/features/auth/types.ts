export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  role: Role;
}
