import React, { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string | null | undefined;
  className?: string;
}

const getAudioUrl = (path: string | null | undefined) => {
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

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, className = "w-full max-w-3xs mx-auto" }) => {
  const [audioError, setAudioError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const url = getAudioUrl(src);
    setCurrentSrc(url);
    setAudioError(false);
  }, [src]);

  const handleAudioError = () => {
    setAudioError(true);
    
    // Try fallback URL if GCS fails
    if (currentSrc.includes("storage.googleapis.com")) {
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:8000/media";
      const fallbackUrl = `${mediaUrl}/${src}`;
      setCurrentSrc(fallbackUrl);
    }
  };

  if (!currentSrc) {
    return <span className="text-red-500">No audio</span>;
  }

  if (audioError && !currentSrc.includes("localhost")) {
    return <span className="text-red-500">Audio file not found</span>;
  }

  return (
    <audio 
      ref={audioRef}
      controls 
      className={className}
      onError={handleAudioError}
    >
      <source src={currentSrc} type="audio/mpeg" />
      <source src={currentSrc} type="audio/mp3" />
      <source src={currentSrc} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
