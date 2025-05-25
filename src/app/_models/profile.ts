import { Centre } from './centre.enum';

export interface Profile {
  id?: number;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  diploma?: string;
  profilePicture?: string;
  bio?: string;
  socialLinks?: string[];
  address?: string;
  centre?: Centre;
  completedSteps?: {
    profile?: boolean;
  };
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?:string;
  phoneNumber?: string;
  diploma?: string;
  profilePicture?: string;
  bio?: string;
  socialLinks?: string[];
  address?: string;
  centre?: Centre;
}
