export interface UserMedia {
  id: number;
  profileId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mediaType: MediaType;
  uploadDate: Date;

  // Newly added fields
  titre: string;
  description: string;
  category: string;
  verified: boolean;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  PRESENTATION = 'PRESENTATION',
  CODE = 'CODE'
}
