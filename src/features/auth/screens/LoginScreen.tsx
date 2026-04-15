import { ActivityIndicator, Button, Text, View } from 'react-native';

type LoginScreenProps = {
  onGoogleLogin: () => Promise<void>;
  onAppleLogin: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function LoginScreen({
  onGoogleLogin,
  onAppleLogin,
  loading,
  error,
}: LoginScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24 }}>
        Dog Social App
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Continue with Google"
          onPress={onGoogleLogin}
          disabled={loading}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Continue with Apple"
          onPress={onAppleLogin}
          disabled={loading}
        />
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 16 }} /> : null}

      {error ? (
        <Text style={{ color: 'red', marginTop: 16 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}