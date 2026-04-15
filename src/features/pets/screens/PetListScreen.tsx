import { 
    ActivityIndicator, 
    Button, 
    ScrollView, 
    Text, 
    View 
} from 'react-native';
import { usePets } from '../hooks/usePets';

type PetListScreenProps = {
  ownerId: string;
  onLogout: () => Promise<void>;
};

export default function PetListScreen({
  ownerId,
  onLogout,
}: PetListScreenProps) {
  const { pets, loading, error, addPet } = usePets(ownerId);

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>
        My Pets
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Add Test Pet"
          onPress={() =>
            addPet({
              name: 'Test Dog',
              size: 'medium',
              can_socialize: true,
            })
          }
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
        </View>
      ))}
    </ScrollView>
  );
}