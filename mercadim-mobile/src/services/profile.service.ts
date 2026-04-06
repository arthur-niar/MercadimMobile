import api from './api';

export interface ProfileData {
  id: string;
  email: string;
  name: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: ProfileData;
}

export const getProfile = async (): Promise<ProfileData> => {
  const response = await api.get<ProfileData>('/profile');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
  const response = await api.put<UpdateProfileResponse>('/profile', data);
  return response.data;
};
