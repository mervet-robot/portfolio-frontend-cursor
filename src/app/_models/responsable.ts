export interface ResponsableRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  phoneNumber?: string;
}

export interface Responsable {
  id?: number;
  username: string;
  email: string;
  role: string;
  active?: boolean;
  profile?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    department?: string;
  };
} 