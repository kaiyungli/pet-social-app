import { useEffect, useState } from 'react';
import { createProfile, getProfileById } from '../services/profileService';
import type { Profile } from '../types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
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

  return { profile, loading, error };
}