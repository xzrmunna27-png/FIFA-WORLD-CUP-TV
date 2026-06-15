import * as React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { TVApp } from '../types';

interface TVAppCardProps {
  app: TVApp;
  isFocused: boolean;
  onFocus: () => void;
  onClick: () => void;
}

export const TVAppCard: React.FC<TVAppCardProps> = ({
  app,
  isFocused,
  onFocus,
  onClick,
}) => {
  // Dynamically resolve lucide icons
  const IconComponent = (Icons as any)[app.iconName] || Icons.Play;

  // Render beautiful visual custom logos matching the picture
  const renderLogo = () => {
    if (app.logoUrl) {
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="shrink-0 h-11 w-11 bg-black/40 rounded-lg p-1.5 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
            <img 
              src={app.logoUrl} 
              alt={app.name} 
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallbackIcon = parent.querySelector('.fallback-icon') as HTMLElement;
                  if (fallbackIcon) fallbackIcon.classList.remove('hidden');
                }
              }}
            />
            <div className="fallback-icon hidden">
              <IconComponent size={20} className="opacity-80 text-blue-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans font-black text-xs text-white uppercase tracking-wider truncate leading-tight">
              {app.name}
            </div>
            <div className="text-[9px] text-zinc-400 font-mono tracking-tighter truncate leading-none mt-1">
              Live TV
            </div>
          </div>
        </div>
      );
    }

    switch (app.id) {
      case 'youtube':
        return (
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#FF0000] rounded-lg p-1.5 flex items-center justify-center">
              <IconComponent size={22} className="fill-current" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight lowercase">
              YouTube
            </span>
          </div>
        );
      case 'prime_video':
        return (
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="font-sans font-extrabold text-sm tracking-wide lowercase italic">
              prime video
            </span>
            <div className="w-14 h-1.5 bg-[#00A8E1] rounded-full self-start transform -rotate-2 -translate-y-0.5 opacity-90" />
          </div>
        );
      case 'bbc_iplayer':
        return (
          <div className="flex items-center gap-1.5">
            <div className="bg-pink-600 text-white font-mono font-black px-1.5 py-0.5 rounded text-xs">B</div>
            <div className="bg-pink-600 text-white font-mono font-black px-1.5 py-0.5 rounded text-xs">B</div>
            <div className="bg-pink-600 text-white font-mono font-black px-1.5 py-0.5 rounded text-xs">C</div>
            <span className="font-sans font-bold text-[#E0267F] tracking-tighter text-sm ml-1">iPlayer</span>
          </div>
        );
      case 'netflix':
        return (
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-2xl tracking-tighter text-[#E50914]">
              N
            </span>
            <span className="font-sans font-extrabold text-xs tracking-ultra-widest text-[#E50914]">
              ETFLIX
            </span>
          </div>
        );
      case 'stadia':
        return (
          <div className="flex items-center gap-2">
            <div className="text-[#FC4C02]">
              <IconComponent size={22} />
            </div>
            <span className="font-sans font-black text-sm tracking-wider text-[#2D2D2D]">
              STADIA
            </span>
          </div>
        );
      case 'geforce_now':
        return (
          <div className="flex items-center justify-between w-full h-full p-1">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">nvidia</span>
              <span className="font-mono text-sm font-extrabold text-white leading-tight">GEFORCE</span>
              <span className="font-mono text-[10px] font-bold text-[#76B900] leading-none">NOW</span>
            </div>
            <IconComponent size={20} className="text-[#76B900]" />
          </div>
        );
      case 'plex':
        return (
          <div className="flex items-center gap-2">
            <span className="font-sans font-black text-xl tracking-wider text-[#E5A93B]">
              PLEX
            </span>
            <IconComponent size={14} className="text-[#E5A93B]" />
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2.5 w-full">
            <div className="shrink-0 p-1 bg-white/10 rounded">
              <IconComponent size={20} className="opacity-95" />
            </div>
            <span className="font-sans font-semibold text-sm truncate leading-tight tracking-wide">
              {app.name}
            </span>
          </div>
        );
    }
  };

  return (
    <motion.button
      id={`tv-app-card-${app.id}`}
      onMouseEnter={onFocus}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={{
        scale: isFocused ? 1.05 : 1.0,
        boxShadow: isFocused
          ? `0 0 25px 4px ${app.accentColor || '#3b82f6'}70, 0 8px 20px -3px rgba(0, 0, 0, 0.6)`
          : '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        borderColor: isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
      }}
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 26,
      }}
      className={`relative flex items-center justify-center h-[76px] w-[148px] rounded-xl border-2 text-left cursor-pointer select-none overflow-hidden ${
        app.bgColor
      } ${app.fgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/80 p-3.5 transition-all duration-300 ${
        isFocused ? 'ring-2 ring-blue-500/60' : ''
      }`}
    >
      {/* Background radial gradient overlay on focus */}
      {isFocused && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_80%)]"
        />
      )}

      {/* Main app label/logo container */}
      <div className="relative z-10 w-full flex items-center">
        {renderLogo()}
      </div>

      {/* Small mini label overlay for system or specific developer contexts */}
      {isFocused && (
        <div className="absolute bottom-1 right-1.5 text-[8px] opacity-75 font-mono">
          {app.developer?.split(' ')[0]}
        </div>
      )}
    </motion.button>
  );
};
