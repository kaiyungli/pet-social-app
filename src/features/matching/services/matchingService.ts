import { supabase } from '../../../lib/supabase';

export async function getMatchingPets(currentUserId: string) {
    const { data, error } = await supabase
        .from('pets')
        .select(`
      id,
      owner_id,
      name,
      breed,
      size,
      can_socialize,
      energy_level,
      bio,
      photo_url,
      interests_text,
      profiles:owner_id (
        id,
        display_name,
        area_text,
        is_searchable
      )
    `)
        .neq('owner_id', currentUserId); // ❌ exclude self

    if (error) {
        throw new Error(error.message);
    }

    // ✅ filter searchable
    const filtered = (data || []).filter((pet: any) => {
        const profile = Array.isArray(pet.profiles) ? pet.profiles[0] : pet.profiles;
        return profile?.is_searchable;
    });

    return filtered;
}