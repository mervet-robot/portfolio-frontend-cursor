export interface SocialLink {
  id?: number;
  platform: string;
  url: string;
}

export interface SocialLinkRequest {
  platform: string;
  url: string;
} 