import React from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  if (!src) return <span className="text-red-500">No audio</span>;

  return (
    <audio controls className="w-full max-w-3xs mx-auto">
      <source src={src} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
