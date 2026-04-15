export type MatchingPetProfile = {
  id: string;
  display_name: string;
  area_text: string | null;
  is_searchable: boolean;
};

export type MatchingPet = {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  size: string;
  can_socialize: boolean;
  energy_level: string | null;
  bio: string | null;
  photo_url: string | null;
  interests_text: string | null;
  profiles: MatchingPetProfile | MatchingPetProfile[] | null;
};