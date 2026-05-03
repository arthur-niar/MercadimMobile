import { RegisterView } from '@/views/RegisterView';
import { useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { refreshProfile } = useProfile();

  const handleBackToLogin = async () => {
    await refreshProfile();
    router.replace('/login');
  };

  return (
    <RegisterView
      onBackToLogin={handleBackToLogin}
    />
  );
}
