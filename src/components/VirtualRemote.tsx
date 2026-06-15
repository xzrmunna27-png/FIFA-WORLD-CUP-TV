import * as React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface VirtualRemoteProps {
  onNavigate: (direction: 'Up' | 'Down' | 'Left' | 'Right') => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
}

export const VirtualRemote: React.FC<VirtualRemoteProps> = ({
  onNavigate,
  onSelect,
  onBack,
  onHome,
}) => {
  const [isPowerOn, setIsPowerOn] = React.useState(true);
  const [volume, setVolume] = React.useState(18);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Remote Container styled like premium matte black polycarbonate casing */}
      <div className="w-[180px] bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-[40px] px-4 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-neutral-700/50 flex flex-col items-center gap-7 relative">
        
        {/* Soft Ambient LED indicator */}
        <div className="absolute top-4 flex items-center justify-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isPowerOn ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
          <span className="text-[7px] text-gray-500 font-mono tracking-widest uppercase">remote link</span>
        </div>

        {/* Navigation Core Power Button Row */}
        <div className="flex items-center justify-between w-full px-2 mt-2">
          <button
            onClick={() => setIsPowerOn(!isPowerOn)}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-red-950 hover:bg-red-950/20 active:scale-95 transition flex items-center justify-center cursor-pointer group"
          >
            <Icons.Power size={16} className={`${isPowerOn ? 'text-red-500' : 'text-zinc-600'}`} />
          </button>
          
          <div className="text-[10px] font-sans font-black tracking-tighter text-neutral-600 select-none">
            ANDROID TV
          </div>

          <button
            onClick={() => {
              const guideEl = document.getElementById('keyboard-guide');
              if (guideEl) guideEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 active:scale-95 transition flex items-center justify-center cursor-pointer"
            title="Help Guide"
          >
            <Icons.HelpCircle size={15} className="text-neutral-400" />
          </button>
        </div>

        {/* Circular D-PAD Controller */}
        <div className="relative w-36 h-36 rounded-full bg-neutral-900 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_4px_8px_rgba(255,255,255,0.05)] border border-neutral-800 p-2.5 flex items-center justify-center">
          
          {/* Inner Circular OK/Select Button */}
          <button
            onClick={onSelect}
            className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700/50 flex items-center justify-center cursor-pointer shadow-md select-none active:bg-neutral-700 active:scale-95 pr-0.5"
          >
            <span className="font-sans font-black text-xs text-white tracking-widest">
              OK
            </span>
          </button>

          {/* UP Button */}
          <button
            onClick={() => onNavigate('Up')}
            className="absolute top-1 left-12 right-12 h-8 hover:bg-white/5 rounded-t-full flex items-center justify-center text-neutral-400 hover:text-white active:bg-white/10 transition cursor-pointer"
            aria-label="Navigate Up"
          >
            <Icons.ChevronUp size={18} />
          </button>

          {/* DOWN Button */}
          <button
            onClick={() => onNavigate('Down')}
            className="absolute bottom-1 left-12 right-12 h-8 hover:bg-white/5 rounded-b-full flex items-center justify-center text-neutral-400 hover:text-white active:bg-white/10 transition cursor-pointer"
            aria-label="Navigate Down"
          >
            <Icons.ChevronDown size={18} />
          </button>

          {/* LEFT Button */}
          <button
            onClick={() => onNavigate('Left')}
            className="absolute left-1 top-12 bottom-12 w-8 hover:bg-white/5 rounded-l-full flex items-center justify-center text-neutral-400 hover:text-white active:bg-white/10 transition cursor-pointer"
            aria-label="Navigate Left"
          >
            <Icons.ChevronLeft size={18} />
          </button>

          {/* RIGHT Button */}
          <button
            onClick={() => onNavigate('Right')}
            className="absolute right-1 top-12 bottom-12 w-8 hover:bg-white/5 rounded-r-full flex items-center justify-center text-neutral-400 hover:text-white active:bg-white/10 transition cursor-pointer"
            aria-label="Navigate Right"
          >
            <Icons.ChevronRight size={18} />
          </button>
        </div>

        {/* Back and Home Action Row */}
        <div className="flex items-center justify-between w-full px-1">
          <button
            onClick={onBack}
            className="flex-1 max-w-[56px] h-11 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 active:scale-95 transition flex flex-col items-center justify-center gap-0.5 text-neutral-300 hover:text-white cursor-pointer"
            title="Back (Backspace)"
          >
            <Icons.CornerUpLeft size={15} />
            <span className="text-[7px] font-mono tracking-widest text-zinc-500 font-extrabold uppercase leading-none">back</span>
          </button>

          <button
            onClick={onHome}
            className="flex-1 max-w-[56px] h-11 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 active:scale-95 transition flex flex-col items-center justify-center gap-0.5 text-neutral-300 hover:text-white cursor-pointer"
            title="Home"
          >
            <Icons.Home size={15} />
            <span className="text-[7px] font-mono tracking-widest text-zinc-500 font-extrabold uppercase leading-none">home</span>
          </button>
        </div>

        {/* Secondary controls (Volume slider) */}
        <div className="w-full flex bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 items-center justify-between">
          <div className="flex flex-col items-center">
            <button
              onClick={() => setVolume((prev) => Math.min(prev + 1, 100))}
              className="p-1 text-neutral-400 hover:text-white active:scale-90 transition cursor-pointer"
            >
              <Icons.Volume2 size={13} />
            </button>
            <span className="text-[8px] font-mono text-zinc-400 font-bold mt-0.5">V+</span>
          </div>

          <div className="flex-1 mx-2 text-center select-none leading-none">
            <div className="text-[9px] text-[#22d3ee] font-mono font-bold">{volume}%</div>
            <div className="text-[6px] text-zinc-500 font-mono">vol</div>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setVolume((prev) => Math.max(prev - 1, 0))}
              className="p-1 text-neutral-400 hover:text-white active:scale-90 transition cursor-pointer"
            >
              <Icons.VolumeX size={13} />
            </button>
            <span className="text-[8px] font-mono text-zinc-400 font-bold mt-0.5">V-</span>
          </div>
        </div>

        {/* Quick App launcher shortkeys */}
        <div className="grid grid-cols-2 gap-2 w-full pt-1.5 border-t border-neutral-900">
          <button
            onClick={() => {
              const card = document.getElementById('tv-app-card-youtube');
              if (card) { card.scrollIntoView({ behavior: 'smooth' }); card.click(); }
            }}
            className="h-7 rounded bg-[#c1121f] text-[9px] font-bold text-white uppercase tracking-wider flex items-center justify-center cursor-pointer shadow hover:opacity-90 active:scale-95"
            title="Launch YouTube"
          >
            YouTube
          </button>
          
          <button
            onClick={() => {
              const card = document.getElementById('tv-app-card-netflix');
              if (card) { card.scrollIntoView({ behavior: 'smooth' }); card.click(); }
            }}
            className="h-7 rounded bg-zinc-900 text-[9px] font-black text-[#E50914] uppercase tracking-wider flex items-center justify-center border border-zinc-800 cursor-pointer shadow hover:bg-neutral-800 active:scale-95"
            title="Launch Netflix"
          >
            Netflix
          </button>
        </div>

        {/* Small battery cover grip notch representation on bottom back for realism */}
        <div className="absolute -bottom-1 w-10 h-1.5 bg-neutral-950 rounded-full border border-neutral-800" />
      </div>

      <div className="mt-3 text-center">
        <span className="text-[9px] text-zinc-500 font-mono tracking-wider">
          Remote Simulator • Active
        </span>
      </div>
    </div>
  );
};
