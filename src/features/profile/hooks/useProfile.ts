import { useEffect, useState } from 'react';
import { 
    createProfile, 
    getProfileById,
    updateProfile,
 } from '../services/profileService';
import type { Profile } from '../types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrapProfile() {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const existingProfile = await getProfileById(userId);

        if (existingProfile) {
          setProfile(existingProfile);
          return;
        }

        const newProfile = await createProfile(userId);
        setProfile(newProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    bootstrapProfile();
  }, [userId]);

  async function saveProfile(updates: {
    display_name?: string;
    bio?: string | null;
    area_text?: string | null;
    is_searchable?: boolean;
    allow_contact_share?: boolean;
    avatar_url?: string | null;
  }) {
    if (!userId) return;

    try {
      setSaving(true);
      setError(null);

      const updated = await updateProfile(userId, updates);
      setProfile(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }


  return { 
    profile, 
    loading, 
    error,
    saving,
    saveProfile,
    };
}