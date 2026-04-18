/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Trophy, Music, Gamepad2, Headphones } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 selection:bg-cyan-500/30">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/30">
            <Gamepad2 className="text-slate-950 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter neon-text-cyan italic">
              NEON <span className="text-pink-500 neon-text-pink">GROOVE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-1.5">
              <Headphones size={10} className="text-cyan-500" /> SNAKE & BEATS MASHUP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl shadow-2xl transition-all duration-300 hover:border-cyan-500/30">
          <div className="bg-slate-800/50 p-2 rounded-xl border border-white/5">
            <Trophy className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Grid Score</span>
            <span className="text-5xl font-digital font-black text-white min-w-[3ch] text-center glitch tracking-tighter shadow-cyan-500/50">
              {score.toString().padStart(3, '0')}
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Game Area */}
        <motion.section 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 flex flex-col items-center"
        >
          <div className="relative p-2 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-2xl">
            <SnakeGame onScoreChange={setScore} isPaused={false} />
            
            {/* Hotkeys Legend */}
            <div className="mt-4 flex gap-4 justify-center">
              {['↑', '←', '↓', '→'].map(k => (
                <div key={k} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 bg-slate-900/40 text-slate-400 font-mono text-sm">
                  {k}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Sidebar Info/Controls */}
        <motion.section 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5 flex flex-col gap-8 items-center lg:items-start"
        >
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.4em] font-black text-slate-500 flex items-center gap-2">
              <Music size={14} className="text-pink-500" /> Now Spinning
            </h2>
            <MusicPlayer />
          </div>

          <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 w-full backdrop-blur-sm">
            <h3 className="text-slate-300 font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" /> Instructions
            </h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex gap-3">
                <span className="text-pink-400 font-mono">01.</span>
                <span>Use arrow keys to navigate the snake through the neon grid.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-mono">02.</span>
                <span>Collect the pink neon spheres to grow and increase your score.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-mono">03.</span>
                <span>Don't hit the walls or yourself, or it's game over!</span>
              </li>
            </ul>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-slate-600 text-[10px] uppercase tracking-[0.4em] font-medium">
        © 2026 NEON GROOVE LABS • POWERED BY AI RHYTHM
      </footer>
    </div>
  );
}
