import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useProfile } from '../hooks/useProfile';

type ProfileScreenProps = {
  userId: string;
};

export default function ProfileScreen({ userId }: ProfileScreenProps) {
  const { profile, loading, saving, error, saveProfile } = useProfile(userId);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [areaText, setAreaText] = useState('');
  const [isSearchable, setIsSearchable] = useState(true);
  const [allowContactShare, setAllowContactShare] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setDisplayName(profile.display_name ?? '');
    setBio(profile.bio ?? '');
    setAreaText(profile.area_text ?? '');
    setIsSearchable(profile.is_searchable);
    setAllowContactShare(profile.allow_contact_share);
  }, [profile]);

  async function handleSave() {
    await saveProfile({
      display_name: displayName.trim(),
      bio: bio.trim() || null,
      area_text: areaText.trim() || null,
      is_searchable: isSearchable,
      allow_contact_share: allowContactShare,
    });
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>
        My Profile
      </Text>

      <Text>Display Name</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 12 }}
      />

      <Text>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 12, minHeight: 100 }}
      />

      <Text>Area</Text>
      <TextInput
        value={areaText}
        onChangeText={setAreaText}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 12 }}
      />

      <View style={{ marginBottom: 16 }}>
        <Text>Allow others to find me</Text>
        <Switch value={isSearchable} onValueChange={setIsSearchable} />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text>Allow contact sharing</Text>
        <Switch value={allowContactShare} onValueChange={setAllowContactShare} />
      </View>

      <Button
        title={saving ? 'Saving...' : 'Save Profile'}
        onPress={handleSave}
        disabled={saving}
      />

      {error ? (
        <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>
      ) : null}
    </ScrollView>
  );
}