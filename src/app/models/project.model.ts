// src/app/models/project.model.ts
export interface Division {
  id: string;
  name: string;
  code: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string; // For local images, this will be a Data URL or Blob URL
  caption?: string;
  dateUploaded: Date;
}

export interface ProjectCategory {
  id: string;
  name: string;
  code: string;
  division: Division;
}

export interface ProjectCategoryDto {
  name: string;
  code: string;
}


export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  dateCreated: Date;
  dateUpdated: Date;
  implementationSchedule: Date;
  dateOfAccomplishment: Date;
  budget: number;
  percentCompletion: number;
  targetParticipant?: string;
  fundSource: string;
  division: Division;
  officeInCharge: string;
  remarks: string;
  projectCategory?: ProjectCategory;
  images: ProjectImage[];
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}
