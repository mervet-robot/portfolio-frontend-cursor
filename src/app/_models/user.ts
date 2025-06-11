export interface Profile {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  sexe?: string;
  address?: string;
  telephone?: string;
  department?: string;
  centre?: string;
}

export interface User {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  profile?: Profile;
}
