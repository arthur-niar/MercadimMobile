import api from "./api";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

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
  const response = await api.get<ProfileData>("/profile");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  const response = await api.put<UpdateProfileResponse>("/profile", data);
  return response.data;
};

// Helper function to read file as Base64
const readFileAsBase64 = async (uri: string): Promise<string> => {
  if (Platform.OS === "web") {
    // For web, fetch the file and convert to base64
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Extract base64 part after the comma
          const base64 = result.includes(",") ? result.split(",")[1] : result;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error reading file on web:", error);
      throw error;
    }
  } else {
    // For native platforms, use expo-file-system
    const base64String = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });
    return base64String;
  }
};

export const uploadProfilePhoto = async (
  photoUri: string,
): Promise<UpdateProfileResponse> => {
  try {
    // Lê o arquivo e converte para base64
    const base64String = await readFileAsBase64(photoUri);

    // Extrai a extensão do arquivo
    const fileExtension = photoUri.split(".").pop()?.toLowerCase() || "jpg";
    const mimeType = getMimeType(fileExtension);

    // Envia como JSON com base64
    const uploadResponse = await api.post<UpdateProfileResponse>(
      "/profile/photo",
      {
        photo: base64String,
        mimeType: mimeType,
        fileName: `profile-photo.${fileExtension}`,
      },
    );

    return uploadResponse.data;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const removeProfilePhoto = async (): Promise<UpdateProfileResponse> => {
  const response = await api.delete<UpdateProfileResponse>("/profile/photo");
  return response.data;
};

// Função auxiliar para obter MIME type
const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[extension] || "image/jpeg";
};
