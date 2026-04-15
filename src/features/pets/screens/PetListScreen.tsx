import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  View,
  TextInput,
} from 'react-native';
import { usePets } from '../hooks/usePets';
import { useState } from 'react';

type PetListScreenProps = {
  ownerId: string;
  activePetId: string | null;
  onLogout: () => Promise<void>;
  navigation: any;
};

export default function PetListScreen({
  ownerId,
  activePetId,
  onLogout,
  navigation,
}: PetListScreenProps) {
  const { pets, loading, error, addPet, editPet, setActivePetForUser } =
    usePets(ownerId);

  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');

  const [localActivePetId, setLocalActivePetId] = useState(activePetId);

  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetSize] = useState('medium');

  async function handleAddPet() {
    await addPet({
      name: newPetName.trim(),
      breed: newPetBreed.trim() || null,
      size: newPetSize,
      can_socialize: true,
    });

    setNewPetName('');
    setNewPetBreed('');
  }

  async function handleSaveEdit(petId: string) {
    await editPet(petId, {
      name: editName.trim(),
      breed: editBreed.trim() || null,
    });

    setEditingPetId(null);
    setEditName('');
    setEditBreed('');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>
        My Pets
      </Text>

      <View
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
          Add Pet
        </Text>

        <Text>Name</Text>
        <TextInput
          value={newPetName}
          onChangeText={setNewPetName}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 8,
          }}
        />

        <Text>Breed</Text>
        <TextInput
          value={newPetBreed}
          onChangeText={setNewPetBreed}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Button title="Add Pet" onPress={handleAddPet} />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      <View style={{ marginBottom: 24 }}>
        <Button title="登出" onPress={onLogout} />
      </View>

      {loading ? <ActivityIndicator /> : null}

      {error ? (
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
      ) : null}

      {!loading && pets.length === 0 ? <Text>未有 pet 資料</Text> : null}

      {pets.map((pet) => (
        <View
          key={pet.id}
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{pet.name}</Text>
          <Text>Breed: {pet.breed ?? 'N/A'}</Text>
          <Text>Size: {pet.size}</Text>
          <Text>Can socialize: {pet.can_socialize ? 'Yes' : 'No'}</Text>

          {localActivePetId === pet.id ? (
            <Text style={{ marginTop: 8, fontWeight: '700' }}>Active Pet</Text>
          ) : (
            <View style={{ marginTop: 8 }}>
              <Button
                title="Set Active"
                onPress={async () => {
                  await setActivePetForUser(pet.id);
                  setLocalActivePetId(pet.id);
                }}
              />
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            <Button
              title="Edit Pet"
              onPress={() => {
                setEditingPetId(pet.id);
                setEditName(pet.name);
                setEditBreed(pet.breed ?? '');
              }}
            />
          </View>

          {editingPetId === pet.id ? (
            <View style={{ marginTop: 12 }}>
              <Text>Name</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  marginBottom: 8,
                }}
              />

              <Text>Breed</Text>
              <TextInput
                value={editBreed}
                onChangeText={setEditBreed}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  marginBottom: 8,
                }}
              />

              <Button title="Save" onPress={() => handleSaveEdit(pet.id)} />

              <View style={{ height: 8 }} />

              <Button
                title="Cancel"
                onPress={() => {
                  setEditingPetId(null);
                  setEditName('');
                  setEditBreed('');
                }}
              />
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}