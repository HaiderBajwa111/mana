export interface AvailableProject {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  thumbnailUrl?: string;
  quantity: number;
  material: string;
  color: string;
  customColor?: string;
  finish: string;
  infill?: number;
  infillPattern?: string;
  resolution?: string;
  scale?: number;
  designNotes?: string;
  referenceImageUrl?: string;
  deadline?: Date;
  createdAt: Date;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  // Additional fields for maker dashboard
  status?: string;
  manufacturerId?: string | null;
  isAssigned?: boolean;
}