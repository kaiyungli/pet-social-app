import { useEffect, useState } from 'react';
import { getPetsByOwner } from '../../services/petService';

export function usePets(ownerId: string) {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPetsByOwner(ownerId);
        setPets(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (ownerId) {
      fetchPets();
    }
  }, [ownerId]);

  return { pets, loading, error };
}