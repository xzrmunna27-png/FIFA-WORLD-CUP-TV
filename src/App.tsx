import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { INITIAL_TV_ROWS } from './data';
import { TVApp, TVRow } from './types';
import { TVAppCard } from './components/TVAppCard';
import { SimulatedAppView } from './components/SimulatedAppView';
import { VirtualRemote } from './components/VirtualRemote';

export default function App() {
  const [rows, setRows] = React.useState<TVRow[]>(INITIAL_TV_ROWS);
  const [focusedRowIndex, setFocusedRowIndex] = React.useState(0);
  const [focusedAppIndex, setFocusedAppIndex] = React.useState(0);
  const [launchedApp, setLaunchedApp] = React.useState<TVApp | null>(null);

  // Time & Date state
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // App Title Header customizing
  const [headerTitle, setHeaderTitle] = React.useState('Essential Android TV apps!');

  // Ambient backlight color preset or dynamic
  const [backlightIntensity, setBacklightIntensity] = React.useState<'off' | 'subtle' | 'vibrant'>('vibrant');

  // Immersive Full Display cinema mode and interactive floating remote states
  const [isFullDisplay, setIsFullDisplay] = React.useState(true);
  const [isFloatingRemoteOpen, setIsFloatingRemoteOpen] = React.useState(false);

  // Customizer form state
  const [isCustomizerOpen, setIsCustomizerOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [formName, setFormName] = React.useState('');
  const [formRowId, setFormRowId] = React.useState('world_cup_2026');
  const [formIcon, setFormIcon] = React.useState('Tv');
  const [formBgColor, setFormBgColor] = React.useState('#10b981'); // default emerald
  const [formAccentColor, setFormAccentColor] = React.useState('#10b981');
  const [formDesc, setFormDesc] = React.useState('');

  // Clock dynamic scheduler
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute currently focused App
  const activeRow = rows[focusedRowIndex];
  const activeApp = activeRow?.apps[focusedAppIndex] || null;

  // Handle Navigation callbacks
  const handleNavigate = React.useCallback(
    (direction: 'Up' | 'Down' | 'Left' | 'Right') => {
      if (launchedApp) return; // Prevent navigation background if app is launched

      if (direction === 'Up') {
        const nextRow = Math.max(focusedRowIndex - 1, 0);
        if (nextRow !== focusedRowIndex) {
          setFocusedRowIndex(nextRow);
          // clamp list length
          const nextRowApps = rows[nextRow]?.apps || [];
          setFocusedAppIndex(Math.min(focusedAppIndex, nextRowApps.length - 1));
        }
      } else if (direction === 'Down') {
        const nextRow = Math.min(focusedRowIndex + 1, rows.length - 1);
        if (nextRow !== focusedRowIndex) {
          setFocusedRowIndex(nextRow);
          const nextRowApps = rows[nextRow]?.apps || [];
          setFocusedAppIndex(Math.min(focusedAppIndex, nextRowApps.length - 1));
        }
      } else if (direction === 'Left') {
        setFocusedAppIndex((prev) => Math.max(prev - 1, 0));
      } else if (direction === 'Right') {
        const currentLength = activeRow?.apps.length || 0;
        setFocusedAppIndex((prev) => Math.min(prev + 1, currentLength - 1));
      }
    },
    [focusedRowIndex, focusedAppIndex, rows, launchedApp, activeRow]
  );

  const handleSelect = React.useCallback(() => {
    if (launchedApp) return;
    if (activeApp) {
      setLaunchedApp(activeApp);
    }
  }, [activeApp, launchedApp]);

  const handleBack = React.useCallback(() => {
    if (launchedApp) {
      setLaunchedApp(null);
    }
  }, [launchedApp]);

  const handleHome = React.useCallback(() => {
    setLaunchedApp(null);
    setFocusedRowIndex(0);
    setFocusedAppIndex(0);
  }, []);

  // Listen to physical mechanical keyboard key-events
  React.useEffect(() => {
    const handlePhysicalKeys = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        // block arrow controls if typing in add form fields
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNavigate('Up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNavigate('Down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigate('Left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigate('Right');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (launchedApp) {
          e.preventDefault();
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handlePhysicalKeys);
    return () => window.removeEventListener('keydown', handlePhysicalKeys);
  }, [handleNavigate, handleSelect, handleBack, launchedApp]);

  // Form submit handler
  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg('App name cannot be empty');
      return;
    }

    const newAppId = `custom_${Date.now()}`;
    const customAppEntry: TVApp = {
      id: newAppId,
      name: formName,
      category: formRowId,
      logoType: 'combined',
      iconName: formIcon,
      bgColor: `bg-[${formBgColor}]`, // dynamic styling colors supported via tailwind inline
      fgColor: 'text-white',
      accentColor: formAccentColor,
      developer: 'Sandbox Customizer',
      rating: 4.5,
      description: formDesc.trim() || 'Custom launcher app deployed dynamically via TV Customizer panel.',
      simulatedContent: {
        title: `${formName} Live Sandbox`,
        description: 'Simulated playback feed channels',
        accentUrl: 'bg-[#1e1b4b]',
        items: [
          { id: 'cs1', title: `Launch sequence ${formName} v1.0`, subtitle: 'Custom user configuration feed', dur: '05:00' },
          { id: 'cs2', title: 'Developer Testing Protocol Live', subtitle: 'Simulated developer console debugging', dur: 'LIVE' }
        ]
      }
    };

    // Inject into selected row
    const updatedRows = rows.map((r) => {
      if (r.id === formRowId) {
        return {
          ...r,
          apps: [...r.apps, customAppEntry],
        };
      }
      return r;
    });

    setRows(updatedRows);
    setIsCustomizerOpen(false);
    setErrorMsg('');

    // Select the new app in index
    const targetedRowIdx = rows.findIndex((r) => r.id === formRowId);
    if (targetedRowIdx !== -1) {
      setFocusedRowIndex(targetedRowIdx);
      setFocusedAppIndex(updatedRows[targetedRowIdx].apps.length - 1);
    }

    // Reset fields
    setFormName('');
    setFormDesc('');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to restore the launcher apps grid to its default state?')) {
      setRows(INITIAL_TV_ROWS);
      setFocusedRowIndex(0);
      setFocusedAppIndex(0);
      setLaunchedApp(null);
      setHeaderTitle('Essential Android TV apps!');
    }
  };

  // Clock formatters
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden antialiased relative">
      {/* Sleek Theme Ambient Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#121226] via-[#05050b] to-[#040406] opacity-95 pointer-events-none z-0" />
      
      {/* Main Container: Full Display Smart TV App Showcase */}
      <main className="flex-1 w-full h-full z-10 flex flex-col relative">
        
        {/* Dynamic Ambilight Backlight glow on Wall behind TV screen */}
        {backlightIntensity !== 'off' && activeApp && (
          <div
            className="absolute left-1/2 top-[45%] transform -translate-x-1/2 -translate-y-1/2 rounded-full filter pointer-events-none transition-all duration-700 ease-out z-0"
            style={{
              width: '100%',
              height: '80%',
              background: `radial-gradient(circle, ${activeApp.accentColor}bb 0%, ${activeApp.accentColor}20 50%, transparent 100%)`,
              opacity: backlightIntensity === 'vibrant' ? 0.35 : 0.15,
              filter: 'blur(110px)',
            }}
          />
        )}

        {/* The clean full screen Display overlay */}
        <div className="w-full h-full flex flex-col relative overflow-hidden z-10">
          
          <AnimatePresence mode="wait">
            {launchedApp ? (
              /* Screen overlay if an app is currently "launched" */
              <motion.div
                key="simulated-app"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-0 z-30"
              >
                <SimulatedAppView app={launchedApp} onClose={handleBack} />
              </motion.div>
            ) : (
              /* MAIN FULL SCREEN SMART TV DASHBOARD */
              <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 bg-[#000000]/20 relative overflow-hidden select-none">
                
                {/* Top of TV Screen Header - Logo and Name only */}
                <div className="flex items-center justify-between z-20 shrink-0 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Icons.Tv className="text-blue-500 fill-blue-500/10 animate-pulse" size={28} />
                    <span className="text-2xl font-black tracking-widest text-[#ffffff] font-display">
                      NEXUS TV
                    </span>
                  </div>
                  
                  {/* Dynamic clock on top right within screen display */}
                  <div className="flex items-center gap-1 bg-white/5 py-1 px-3 rounded-md font-bold text-zinc-200">
                    <Icons.Clock size={12} className="text-blue-400" />
                    <span className="text-sm">{formattedTime.slice(0, 5)}</span>
                  </div>
                </div>

                {/* Featured Show / Application Details Top Banner */}
                <div className="h-28 md:h-36 relative rounded-2xl overflow-hidden shrink-0 border border-white/5 bg-gradient-to-r from-black via-black/50 to-transparent p-4 flex flex-col justify-center gap-1 mt-4 mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 to-[#6366f1]/10 opacity-35 blur-2xl pointer-events-none" />
                  <div className="text-[9px] font-extrabold text-blue-400 tracking-[0.2em] uppercase font-mono">FEATURED TODAY</div>
                  <h2 className="text-lg md:text-2xl font-black text-white tracking-tight leading-none uppercase font-display">
                    {activeApp ? activeApp.name : 'Adventure Odyssey'}
                  </h2>
                  <p className="text-[10px] md:text-xs text-zinc-400 max-w-sm ml-0.5 line-clamp-1 leading-relaxed italic font-sans">
                    {activeApp ? activeApp.description : 'Explore premium immersive application sequences.'}
                  </p>
                  
                  <div className="flex gap-2.5 mt-2 ml-0.5">
                    <button
                      onClick={() => activeApp && setLaunchedApp(activeApp)}
                      className="px-4 py-1.5 bg-white text-black font-extrabold rounded-lg text-[10px] uppercase tracking-wide hover:bg-neutral-200 transition cursor-pointer active:scale-95 animate-pulse"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>

                {/* INTERACTIVE horizontal sliding rows for launchers */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar py-2">
                  {rows.map((row, rIdx) => {
                    const isRowFocused = rIdx === focusedRowIndex;
                    
                    // Calculate target transform translation offset to scroll shelf horizontally on focus
                    const shelfOffset = isRowFocused ? Math.max(0, (focusedAppIndex - 3) * 160) : 0;

                    return (
                      <div key={row.id} className="relative flex flex-col items-start px-0.5">
                        {/* Row title with glow badge on focused row */}
                        <div className="flex items-center gap-1.5 mb-2">
                          {isRowFocused && (
                            <span className="w-1.5 h-3.5 rounded bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                          )}
                          <h3 className={`text-[11px] font-bold tracking-widest font-sans uppercase transition-colors duration-200 ${
                            isRowFocused ? 'text-white font-extrabold shadow-sm' : 'text-zinc-500'
                          }`}>
                            {row.title}
                          </h3>
                        </div>

                        {/* Sliding App Cards Tray */}
                        <div className="w-full overflow-hidden">
                          <motion.div
                            animate={{ x: -shelfOffset }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            className="flex gap-4 items-center pr-36"
                          >
                            {row.apps.map((app, aIdx) => {
                              const isAppFocused = isRowFocused && (aIdx === focusedAppIndex);
                              return (
                                <TVAppCard
                                  key={app.id}
                                  app={app}
                                  isFocused={isAppFocused}
                                  onFocus={() => {
                                    setFocusedRowIndex(rIdx);
                                    setFocusedAppIndex(aIdx);
                                  }}
                                  onClick={() => {
                                    setFocusedRowIndex(rIdx);
                                    setFocusedAppIndex(aIdx);
                                    setLaunchedApp(app);
                                  }}
                                />
                              );
                            })}
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Focused App detail contextual preview overlay */}
                <div className="h-8 border-t border-white/5 pt-2 flex items-center justify-between text-zinc-500 text-[10px] md:text-xs z-10 select-none">
                  {activeApp ? (
                    <div className="flex items-center gap-2 w-full">
                      <Icons.Info size={12} className="text-blue-400 flex-shrink-0 animate-bounce" />
                      <div className="flex-1 truncate max-w-full leading-none">
                        <span className="font-extrabold text-slate-100 tracking-wide uppercase mr-2.5">
                          {activeApp.name}
                        </span>
                        <span className="text-zinc-400 italic">
                          "{activeApp.description}"
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span>Highlight any channel tile to explore parameters</span>
                  )}
                </div>

              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
