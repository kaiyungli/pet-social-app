import { useEffect, useState } from 'react';
import { createPet, getPetsByOwner } from '../services/petService';
import type { Pet } from '../types';
import { setActivePet } from '../../profile/services/profileService';


export function usePets(ownerId: string) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPetsByOwner(ownerId);
        setPets(data);
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

  //create pet
  async function addPet(newPet: {
    name: string;
    size: string;
    can_socialize: boolean;
  }) {
    try {
      setLoading(true);
      setError(null);

      //step 1: create pet
      const created = await createPet({
        owner_id: ownerId,
        ...newPet,
      });

      //step 2: if first pet -> set to active
      if(pets.length === 0){
        await setActivePet(ownerId, created.id)
      }

      //step 3: refresh List
      const updatedPets = await getPetsByOwner(ownerId);
      setPets(updatedPets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  
  return { pets, loading, error, addPet };
}