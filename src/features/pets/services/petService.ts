import { supabase } from '../../../lib/supabase';
import type { Pet } from '../types';

export async function getPetsByOwner(ownerId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

//create pet
export async function createPet(payload: {
  owner_id: string;
  name: string;
  size: string;
  can_socialize: boolean;
}): Promise<Pet> {
  const { data, error } = await supabase
    .from('pets')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}