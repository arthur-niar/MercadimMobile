import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProfile, ProfileData } from '@/services/profile.service';
import { authService } from '@/services/auth.service';

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfileData: (data: Partial<ProfileData>) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await authService.getToken();
      if (!token) {
        setProfile(null);
        return;
      }

      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setProfile(null);
      } else {
        console.error('Error loading profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const clearProfile = () => {
    setProfile(null);
  };

  useEffect(() => {
    if (!initialized) {
      fetchProfile();
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile, updateProfileData, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
