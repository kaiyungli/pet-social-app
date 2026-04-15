import { supabase } from '../../../lib/supabase';
import type { Profile } from '../types';

export async function getProfileById(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

//create user
export async function createProfile(userId: string): Promise<Profile> {
  const payload = {
    id: userId,
    display_name: 'New User',
    area_text: null,
    is_searchable: true,
    allow_contact_share: false,
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function setActivePet(userId: string, petId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ active_pet_id: petId })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}