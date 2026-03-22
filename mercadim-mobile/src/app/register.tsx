import { RegisterView } from '@/views/RegisterView';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <RegisterView
      onBackToLogin={() => router.replace('/login')}
    />
  );
}