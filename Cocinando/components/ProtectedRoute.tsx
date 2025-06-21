import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { authState } = useAuth();
  const { user, isLoading, isAdmin } = authState;
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4C5F00" />
      </View>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // If admin access is required but user is not admin
  if (adminOnly && !isAdmin) {
    return <Redirect href="/homeScreen" />;
  }

  return <>{children}</>;
}
