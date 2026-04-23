import api from './api';

export interface ProfileData {
  id: string;
  email: string;
  name: string;
  url?: string;
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

export const uploadProfilePhoto = async (photoUri: string): Promise<UpdateProfileResponse> => {
  const formData = new FormData();
  
  // Converte o URI da foto para um blob para envio
  const response = await fetch(photoUri);
  const blob = await response.blob();
  
  formData.append('photo', blob, 'profile-photo.jpg');
  
  const uploadResponse = await api.post<UpdateProfileResponse>(
    '/profile/photo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return uploadResponse.data;
};

export const removeProfilePhoto = async (): Promise<UpdateProfileResponse> => {
  const response = await api.delete<UpdateProfileResponse>('/profile/photo');
  return response.data;
};
