import { MediaType } from './project-media';

export interface RespProjectMedia {
  id: number;
  respProjectId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mediaType: MediaType;
  uploadDate: Date;
} 