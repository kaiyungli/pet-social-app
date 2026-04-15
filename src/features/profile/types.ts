export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  area_text: string | null;
  is_searchable: boolean;
  allow_contact_share: boolean;
  active_pet_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};