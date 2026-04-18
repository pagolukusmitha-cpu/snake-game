import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, Point } from '../types';
import { GAME_CONFIG } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(GAME_CONFIG.INITIAL_SPEED);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection(Direction.RIGHT);
    setGameOver(false);
    setScore(0);
    setSpeed(GAME_CONFIG.INITIAL_SPEED);
    onScoreChange(0);
    generateFood([{ x: 10, y: 10 }]);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== Direction.DOWN) setDirection(Direction.UP);
        break;
      case 'ArrowDown':
        if (direction !== Direction.UP) setDirection(Direction.DOWN);
        break;
      case 'ArrowLeft':
        if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
        break;
      case 'ArrowRight':
        if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GAME_CONFIG.GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GAME_CONFIG.GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setSpeed(s => Math.max(GAME_CONFIG.MIN_SPEED, s - GAME_CONFIG.SPEED_INCREMENT));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GAME_CONFIG.GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GAME_CONFIG.GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#f472b6'; // pink-400
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f472b6';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#22d3ee' : '#0891b2'; // cyan-400/cyan-600
      ctx.shadowBlur = i === 0 ? 15 : 5;
      ctx.shadowColor = '#22d3ee';
      ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
    });

  }, [snake, food]);

  return (
    <div className="relative group w-full max-w-[400px]">
      <div className="aspect-square w-full">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full rounded-xl border-2 border-slate-800 transition-all duration-300 group-hover:border-cyan-500/50"
        />
      </div>
      
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl overflow-hidden"
          >
            <h2 className="text-4xl font-bold text-pink-500 mb-2 tracking-tighter shadow-pink-500/50 drop-shadow-xl">GAME OVER</h2>
            <p className="text-cyan-400 font-mono text-xl mb-6">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 border-2 border-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
