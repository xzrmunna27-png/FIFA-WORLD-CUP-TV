import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { TVApp } from '../types';
import Hls from 'hls.js';

interface SimulatedAppViewProps {
  app: TVApp;
  onClose: () => void;
}

export const SimulatedAppView: React.FC<SimulatedAppViewProps> = ({ app, onClose }) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [showControls, setShowControls] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [playError, setPlayError] = React.useState<string | null>(null);
  
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = React.useRef<any>(null);

  // Auto-hide controls after 4 seconds of idle activity
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  React.useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  React.useEffect(() => {
    // Reset state on app mount
    setIsPlaying(true);
    setIsLoading(true);
    setPlayError(null);
  }, [app]);

  React.useEffect(() => {
    if (app.streamUrl && videoRef.current) {
      const video = videoRef.current;
      setIsLoading(true);
      setPlayError(null);

      let hls: Hls | null = null;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });
        hls.loadSource(app.streamUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(err => {
            console.warn("Autoplay was blocked by browser or failed:", err);
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn("Fatal network error detected, attempting to recover...");
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("Fatal media error, attempting to recover...");
                hls?.recoverMediaError();
                break;
              default:
                console.error("Fatal unrecoverable HLS stream error:", data);
                setPlayError("The IPTV broadcast stream is temporarily offline or inaccessible. Please try again later.");
                setIsLoading(false);
                hls?.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for native Safari stream
        video.src = app.streamUrl;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          video.play().catch(err => {
            console.warn("Safari autoplay blocked:", err);
          });
        });
        video.addEventListener('error', (e) => {
          console.error("Native video play error:", e);
          setPlayError("Native HLS stream decoding failed. This stream may be offline or restricted.");
          setIsLoading(false);
        });
      } else {
        setPlayError("Your browser layout does not support HLS (.m3u8) playback.");
        setIsLoading(false);
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else {
      setIsLoading(false);
    }
  }, [app.streamUrl, isPlaying]);

  // Support Key Bindings for standard IPTV remote commands
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimeout();
      
      if (e.key === 'Enter' || e.key === ' ') {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
        e.preventDefault();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
        e.preventDefault();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        onClose();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isPlaying]);

  return (
    <div 
      className="absolute inset-0 z-50 bg-[#020203] flex flex-col overflow-hidden select-none"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* Real Live Video HTML5 Embed */}
      {app.streamUrl && isPlaying && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          muted={isMuted}
          playsInline
        />
      )}

      {/* Loading stream spinner overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10">
          <Icons.Loader className="animate-spin text-blue-500 mb-4" size={40} />
          <p className="text-sm font-semibold tracking-wider text-zinc-300 uppercase font-mono animate-pulse">
            Connecting to Live IPTV Stream...
          </p>
          <p className="text-xs text-zinc-500 font-sans mt-2">
            Buffering {app.name} HD feed
          </p>
        </div>
      )}

      {/* Error display overlay */}
      {playError && (
        <div className="absolute inset-0 bg-[#0d0d11]/95 flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full mb-4">
            <Icons.AlertOctagon size={44} />
          </div>
          <h3 className="font-display font-black text-xl text-white mb-2 uppercase tracking-wide">
            Broadcast Stream Offline
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm font-sans leading-relaxed mb-6">
            {playError}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPlayError(null);
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 200);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-500/20 transition active:scale-95 cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-zinc-200 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              Back to TV Hub
            </button>
          </div>
        </div>
      )}

      {/* Modern Smart TV HUD Player Overlay Controls */}
      <AnimatePresence>
        {showControls && !playError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 flex flex-col justify-between p-6 md:p-8 z-30"
          >
            {/* Top Bar: Navigation indicator and Live Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 md:p-2.5 rounded-full bg-black/50 hover:bg-white/10 text-white transition-all border border-white/5 shadow-md flex items-center justify-center active:scale-90 cursor-pointer"
                  title="Back to Grid"
                >
                  <Icons.ArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base md:text-xl font-black text-white uppercase tracking-tight font-display">
                      {app.name}
                    </span>
                    <span className="h-5 px-1.5 rounded bg-red-600 text-white font-mono font-extrabold text-[9px] tracking-widest flex items-center justify-center animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {app.developer} • IPTV Feed
                  </span>
                </div>
              </div>

              {/* Top Right Specs info */}
              <div className="flex items-center gap-2 bg-black/60 border border-white/5 py-1 px-3 rounded-lg font-mono text-[10px] text-zinc-300">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                <span>60 FPS • 1080P H264</span>
              </div>
            </div>

            {/* Middle: Screen Pause state notification (if paused manually) */}
            {!isPlaying && !isLoading && (
              <div className="self-center flex flex-col items-center gap-3 bg-black/70 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md animate-bounce shadow-2xl">
                <Icons.Pause className="text-blue-400 fill-blue-400/10" size={36} />
                <span className="text-xs font-bold uppercase text-white tracking-widest leading-none font-mono">
                  Broadcast Paused
                </span>
              </div>
            )}

            {/* Bottom Panel: Live scrub info and Audio, Options controls */}
            <div className="flex flex-col gap-4">
              {/* Channel metadata description */}
              <div className="max-w-xl text-left bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-1">
                  Now Streaming
                </h4>
                <p className="text-xs text-white leading-relaxed font-sans font-medium line-clamp-2">
                  {app.description}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                  M3U8 Stream Source Active
                </p>
              </div>

              {/* Status Indicator & Live timing Line */}
              <div className="flex items-center gap-3 w-full">
                <span className="text-[9px] font-mono text-zinc-400">00:00</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full opacity-80" />
                </div>
                <div className="flex items-center gap-1.5 bg-red-600/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold text-[9px] tracking-wide font-mono uppercase">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                  <span>Streaming Live</span>
                </div>
              </div>

              {/* Controller Hub */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) {
                          videoRef.current.pause();
                          setIsPlaying(false);
                        } else {
                          videoRef.current.play().catch(() => {});
                          setIsPlaying(true);
                        }
                      }
                    }}
                    className="p-3 rounded-full bg-white text-black hover:bg-neutral-200 transition active:scale-90 flex items-center justify-center cursor-pointer shadow-md"
                    title={isPlaying ? "Pause Stream" : "Play Stream"}
                  >
                    {isPlaying ? <Icons.Pause size={18} className="fill-current" /> : <Icons.Play size={18} className="fill-current" />}
                  </button>

                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="p-3 rounded-full bg-black/60 border border-white/5 text-white hover:bg-white/10 transition active:scale-95 flex items-center justify-center cursor-pointer"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? <Icons.VolumeX size={18} className="text-red-400" /> : <Icons.Volume2 size={18} />}
                  </button>

                  <button
                    onClick={onClose}
                    className="px-4 py-3 rounded-xl bg-orange-700 text-white hover:bg-red-700 transition active:scale-95 flex items-center gap-1.5 font-bold text-xs"
                  >
                    <Icons.Home size={14} />
                    <span>Back to Hub</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-zinc-400">
                  <Icons.Keyboard size={13} className="text-zinc-500" />
                  <span>[ENTER/SPACE] Play/Pause • [M] Mute • [ESC/BACKSPACE] Exit Stream</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
