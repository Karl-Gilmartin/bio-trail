import { supabase } from "./supabaseClient";

export function getImageUrl(imageName: string) {
  if (!imageName) return "/blog-placeholder.svg"; // Default image

  const encodedImageName = encodeURIComponent(imageName.trim()); // ✅ Handles spaces & special characters

  return `https://isohaasayrfivjupnwuv.supabase.co/storage/v1/object/public/blog-images/${encodedImageName}`;
}
