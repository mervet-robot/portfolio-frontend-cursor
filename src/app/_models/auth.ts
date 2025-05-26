export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  sexe: string;
  centre: string;
  address: string;

}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;

  firstName?: string;  // Add these
  lastName?: string;   // Add these
  phoneNumber: string;

}

export interface DirecteurRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  sexe: string;
  centre: string;
  address: string;
}

export interface RecruteurRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company: string;

  sexe: string;
  centre: string;
  address: string;

}
