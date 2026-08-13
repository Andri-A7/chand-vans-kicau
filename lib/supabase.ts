import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadBirdImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `birds/${fileName}`;
  const { error } = await supabase.storage
    .from("bird-images")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("bird-images").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteBirdImage(url: string): Promise<void> {
  const path = url.split("/bird-images/")[1];
  if (!path) return;
  await supabase.storage.from("bird-images").remove([path]);
}
