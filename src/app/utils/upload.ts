export async function uploadImage(file: File): Promise<string> {
  // TODO: Implement actual image upload
  // For now, we'll just return a placeholder URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
} 