import { supabase } from '../../constants/supabase';

export type Profile = {
  id: string;
  email?: string | null;
  shop_name?: string | null;
  owner_name?: string | null;
  created_at?: string | null;
};

export async function fetchProfileById(id: string) {
  const { data, error } = await supabase
    .from<Profile>('profiles')
    .select('id, email, shop_name, owner_name, created_at')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMyProfile() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;
  if (!user) return null;
  return fetchProfileById(user.id);
}

export async function updateMyProfile(payload: { shop_name?: string | null; owner_name?: string | null }) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;
  if (!user) throw new Error('Not authenticated');

  const updates = {
    id: user.id,
    email: user.email,
    shop_name: payload.shop_name ?? null,
    owner_name: payload.owner_name ?? null,
  } as Partial<Profile>;

  const { data, error } = await supabase.from('profiles').upsert(updates, { returning: 'representation' });
  if (error) throw error;
  return data?.[0] ?? null;
}
