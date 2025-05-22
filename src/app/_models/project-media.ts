export interface ProjectMedia {
  id: number;
  projectId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mediaType: MediaType;
  uploadDate: Date;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  PRESENTATION = 'PRESENTATION',
  CODE = 'CODE'
}
