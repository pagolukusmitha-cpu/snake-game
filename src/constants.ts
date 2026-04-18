import { Track } from './types';

export const MUSIC_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber2/400/400',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Binary Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid3/400/400',
  },
];

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 2,
  MIN_SPEED: 60,
};
