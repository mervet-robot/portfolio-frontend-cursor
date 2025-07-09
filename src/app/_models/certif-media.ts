export interface CertifMedia {
  id: number;
  userId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mediaType: MediaType;
  uploadDate: Date;

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