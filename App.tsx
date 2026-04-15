import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from './src/features/auth/hooks/useAuth';
import { useProfile } from './src/features/profile/hooks/useProfile';

import LoginScreen from './src/features/auth/screens/LoginScreen';
import PetListScreen from './src/features/pets/screens/PetListScreen';
import ProfileScreen from './src/features/profile/screens/ProfileScreen';
import MatchingListScreen from './src/features/matching/screens/MatchingListScreen';
import MatchingDetailScreen from './src/features/matching/screens/MatchingDetailScreen';

const Stack = createNativeStackNavigator();

function MainStack({
  profile,
  logout,
}: {
  profile: any;
  logout: () => Promise<void>;
}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pets">
        {(props) => (
          <PetListScreen
            {...props}
            ownerId={profile.id}
            activePetId={profile.active_pet_id ?? null}
            onLogout={logout}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Profile">
        {() => <ProfileScreen userId={profile.id} />}
      </Stack.Screen>
      <Stack.Screen name="Matching" component={MatchingListScreen} />
      <Stack.Screen
        name="MatchingDetail"
        component={MatchingDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.pet?.name ?? 'Pet Detail',
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const {
    user,
    loading,
    authLoading,
    error,
    isLoggedIn,
    loginWithGoogle,
    loginWithApple,
    logout,
  } = useAuth();

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
    return (
      <LoginScreen
        onGoogleLogin={loginWithGoogle}
        onAppleLogin={loginWithApple}
        loading={authLoading}
        error={error}
      />
    );
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{profileError}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainStack profile={profile} logout={logout} />
    </NavigationContainer>
  );
}