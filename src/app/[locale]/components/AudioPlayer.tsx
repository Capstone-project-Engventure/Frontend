import React from "react";

interface AudioPlayerProps {
  src: string | null | undefined;
}

const getPublicUrl = (path: string | null | undefined) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_GCS_BASE_URL}/${path}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const publicUrl = getPublicUrl(src);

  if (!publicUrl) {
    return <span className="text-red-500">No audio</span>;
  }

  return (
    <audio controls className="w-full max-w-3xs mx-auto">
      <source src={publicUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
