import { supabase } from '../../../lib/supabase';

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

//For IOS
export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

//For Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}