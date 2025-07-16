/**
 * Utility function to get audio URL with fallback support
 * Tries GCS first, then falls back to local media URL
 */
export const getAudioUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  
  // If path already starts with http, return as is
  if (path.startsWith("http")) {
    return path;
  }
  
  // Try GCS first if GCS_BASE_URL is available
  const gcsBaseUrl = process.env.NEXT_PUBLIC_GCS_BASE_URL;
  if (gcsBaseUrl) {
    return `${gcsBaseUrl}/${path}`;
  }
  
  // Fallback to local media URL
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8000/media";
  return `${mediaUrl}/${path}`;
};

/**
 * Play audio from URL with error handling
 */
export const playAudio = (url: string, playbackRate: number = 1): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.playbackRate = playbackRate;
    
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error("Failed to play audio"));
    
    audio.play().catch(reject);
  });
};

/**
 * Create audio blob URL for local playback
 */
export const createAudioBlobUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

/**
 * Revoke audio blob URL to free memory
 */
export const revokeAudioBlobUrl = (url: string): void => {
  URL.revokeObjectURL(url);
}; 