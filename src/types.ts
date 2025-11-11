export interface JobData {
  title: string;
  company: string;
  distanceMiles: string;
  hourlyRate: string;
  shiftDates: string[];
  location: string;
  locationDetail: string;
  requirements: string[];
  reportTo: string;
}

export interface Constants {
  SWIPE_GREEN: string;
  PLACEHOLDER_IMAGE_URL: string;
  USER_NAME: string;
  JOB_DATA: JobData;
}

export interface HeaderProps {
  name: string;
}

export interface DetailItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  subText?: string;
  hasArrow?: boolean;
  onArrowClick?: () => void;
}

// API - Types
export interface WorkerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: {
    formattedAddress: string;
    zoneId: string;
  };
  maxJobDistance?: number;
}

export interface JobShift {
  startDate: string;
  endDate: string;
}

export interface JobCompany {
  name: string;
  address: {
    formattedAddress: string;
    zoneId: string;
  };
  reportTo: {
    name: string;
    phone?: string;
  };
}

export interface JobTitle {
  name: string;
  imageUrl: string;
}

export interface Job {
  jobId: string;
  jobTitle: JobTitle;
  company: JobCompany;
  wagePerHourInCents: number;
  milesToTravel?: number;
  shifts: JobShift[];
  branch?: string;
  branchPhoneNumber?: string;
  requirements?: string[];
}

export interface JobWithDistance extends Job {
  distanceFromSearch: string | null | undefined;
}

export interface JobActionResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
}
