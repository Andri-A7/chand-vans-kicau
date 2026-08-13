import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars tidak tersedia");
  _supabase = createClient(url, key);
  return _supabase;
}

export async function uploadBirdImage(file: File): Promise<string> {
  const supabase = getSupabase();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `birds/${fileName}`;

  const { error } = await supabase.storage
    .from("bird-images")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("bird-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteBirdImage(url: string): Promise<void> {
  const supabase = getSupabase();
  const path = url.split("/bird-images/")[1];
  if (!path) return;
  await supabase.storage.from("bird-images").remove([path]);
}
