import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from './src/features/auth/hooks/useAuth';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import PetListScreen from './src/features/pets/screens/PetListScreen';
import { useProfile } from './src/features/profile/hooks/useProfile';

export default function App() {
  const { user, loading, authLoading, error, isLoggedIn, login, logout } =
    useAuth();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile(user?.id ?? null);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return <LoginScreen onLogin={login} loading={authLoading} error={error} />;
  }

  if (profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Loading profile...</Text>
      </View>
    );
  }

  if (profileError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Text style={{ color: 'red', textAlign: 'center' }}>
          {profileError}
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Preparing profile...</Text>
      </View>
    );
  }

  return <PetListScreen ownerId={profile.id} onLogout={logout} />;
}