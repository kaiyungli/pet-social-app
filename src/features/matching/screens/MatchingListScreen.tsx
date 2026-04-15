import { ActivityIndicator, Text, View, ScrollView, Button } from 'react-native';
import { useMatchingPets } from '../hooks/useMatchingPets';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
    route: any;
    navigation: any;
};

export default function MatchingListScreen({ route, navigation }: Props) {
    const userId = route.params?.userId ?? null;

    const { pets, loading, error } = useMatchingPets(userId);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [onlySocial, setOnlySocial] = useState(false);

    const filteredPets = pets.filter((pet) => {
        if (selectedSize && pet.size !== selectedSize) {
            return false;
        }

        if (onlySocial && !pet.can_socialize) {
            return false;
        }

        return true;
    });

    return (
        <ScrollView contentContainerStyle={{ padding: 24 }}>

            <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>
                Matching
            </Text>

            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                    Filters
                </Text>

                <View style={{ marginBottom: 8 }}>
                    <Button title="Small" onPress={() => setSelectedSize('small')} />
                </View>
                <View style={{ marginBottom: 8 }}>
                    <Button title="Medium" onPress={() => setSelectedSize('medium')} />
                </View>
                <View style={{ marginBottom: 8 }}>
                    <Button title="Large" onPress={() => setSelectedSize('large')} />
                </View>
                <View style={{ marginBottom: 8 }}>
                    <Button title="Clear Size" onPress={() => setSelectedSize(null)} />
                </View>

                <Button
                    title={onlySocial ? 'Social Only: ON' : 'Social Only: OFF'}
                    onPress={() => setOnlySocial(!onlySocial)}
                />
            </View>

            {loading && <ActivityIndicator />}

            {error && (
                <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
            )}

            {!loading && filteredPets.length === 0 && (
                <Text>No matches found</Text>
            )}

            {filteredPets.map((pet) => {
                const profile = Array.isArray(pet.profiles)
                    ? pet.profiles[0]
                    : pet.profiles;

                return (
                    <TouchableOpacity
                        key={pet.id}
                        onPress={() =>
                            navigation.navigate('MatchingDetail', { pet })
                        }
                    >
                        <View
                            style={{
                                padding: 16,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 12,
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>
                                {pet.name}
                            </Text>

                            <Text>Breed: {pet.breed ?? 'N/A'}</Text>
                            <Text>Size: {pet.size}</Text>
                            <Text>Can socialize: {pet.can_socialize ? 'Yes' : 'No'}</Text>
                            <Text>Owner: {profile?.display_name ?? 'Unknown'}</Text>
                            <Text>Area: {profile?.area_text ?? 'N/A'}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}