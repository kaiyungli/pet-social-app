export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  age_years: number | null;
  gender: string | null;
  size: string;
  is_neutered: boolean | null;
  can_socialize: boolean;
  energy_level: string | null;
  bio: string | null;
  photo_url: string | null;
  interests_text: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};