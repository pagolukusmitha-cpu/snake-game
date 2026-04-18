import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSIC_TRACKS } from '../constants';
import { Track } from '../types';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 blur-3xl -z-10 animate-pulse delay-700" />

      <div className="flex items-center gap-6">
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -5, scale: 0.95, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/5 shadow-lg"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex gap-1 items-end h-8">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 20, 10, 24, 6] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-1 bg-cyan-400 rounded-full"
                    />
                  ))}
                </div>
             </div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-slate-400 text-sm truncate font-medium">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={handlePrev} className="text-slate-400 hover:text-cyan-400 transition-colors">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={handleNext} className="text-slate-400 hover:text-cyan-400 transition-colors">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
    </div>
  );
};

export default MusicPlayer;
