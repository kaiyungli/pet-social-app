import { supabase } from '../lib/supabase';

export async function getPetsByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}