import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, VolumeX, BarChart3 } from 'lucide-react';

interface AudioSystemProps {
  selectedSound: string;
  onSoundChange: (sound: string) => void;
  volume: number[];
  onVolumeChange: (volume: number[]) => void;
}

const AudioSystem: React.FC<AudioSystemProps> = ({
  selectedSound,
  onSoundChange,
  volume,
  onVolumeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🎵 Add your own files in public/ambient/
  const ambientSounds = {
    rain: {
      name: '🌧️ Rain',
      file: '/ambient/rain.mp3',
      description: 'Gentle rainfall'
    },
    forest: {
      name: '🌲 Forest',
      file: '/ambient/forest.mp3',
      description: 'Birds and nature'
    },
    cafe: {
      name: '☕ Café',
      file: '/ambient/cafe.mp3',
      description: 'Coffee shop ambience'
    },
    'white-noise': { 
      name: '📻 White Noise', 
      file: '/ambient/lofi2.mp3', 
      description: 'Pure focus sound' 
    }, 
    lofi: { 
      name: '🎵 Lofi', 
      file: '/ambient/lofi1.mp3', 
      description: 'Chill beats'
    }
  };

  useEffect(() => {
    // Create audio element with preload
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = true; // 🔁 loop enabled
    audio.volume = volume[0] / 100;

    // Load correct file based on selection
    const selectedFile = ambientSounds[selectedSound as keyof typeof ambientSounds]?.file;
    audio.src = selectedFile || "";

    audioRef.current = audio;

    const handleCanPlayThrough = () => setIsLoading(false);
    const handleLoadStart = () => setIsLoading(true);

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('loadstart', handleLoadStart);

    if (isPlaying) {
      audio.play().catch(err => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.pause();
    };
  }, [selectedSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Ambient Sounds</label>
        <div className="flex items-center space-x-2">
          {isPlaying && !isMuted && (
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4 text-study-success animate-pulse" />
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-study-success rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 16 + 4}px`,
                      animationDelay: `${i * 150}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="p-2"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-study-focus" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Select value={selectedSound} onValueChange={onSoundChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ambientSounds).map(([key, sound]) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-col items-start">
                  <span>{sound.name}</span>
                  <span className="text-xs text-muted-foreground">{sound.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-3">
          <Button
            variant={isPlaying ? "secondary" : "outline"}
            size="sm"
            onClick={togglePlayPause}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : isPlaying ? (
              <>
                <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse" />
                Playing
              </>
            ) : (
              'Play'
            )}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={volume}
              onValueChange={onVolumeChange}
              max={100}
              step={1}
              className="w-full"
              disabled={isMuted}
            />
          </div>
          
          <span className="text-xs text-muted-foreground w-8 text-right">
            {isMuted ? '0' : volume[0]}%
          </span>
        </div>
      </div>

      {selectedSound && (
        <div className="text-xs text-muted-foreground">
          Current: {ambientSounds[selectedSound as keyof typeof ambientSounds]?.description}
        </div>
      )}
    </div>
  );
};

export default AudioSystem;
