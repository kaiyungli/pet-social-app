import { ActivityIndicator, Button, Text, View } from 'react-native';

type LoginScreenProps = {
  onLogin: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function LoginScreen({
  onLogin,
  loading,
  error,
}: LoginScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>
        Pet Social App
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 24 }}>請先登入</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="匿名登入" onPress={onLogin} />
      )}

      {error ? (
        <Text style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}