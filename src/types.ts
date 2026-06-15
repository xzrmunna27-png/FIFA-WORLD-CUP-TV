export interface TVApp {
  id: string;
  name: string;
  category: string;
  logoType: 'svg' | 'text' | 'combined';
  iconName: string; // references lucide icons or custom shapes
  bgColor: string;  // Tailwind background class
  fgColor: string;  // Tailwind text/foreground class
  accentColor: string; // Hex color for focus rings & ambient glow
  developer?: string;
  rating?: number;
  description: string;
  logoUrl?: string;  // Real-world channel logo image URL
  streamUrl?: string; // Live HLS stream (.m3u8) source
  simulatedContent: {
    title: string;
    description: string;
    previewUrl?: string;
    accentUrl?: string;
    items?: Array<{ id: string; title: string; subtitle: string; dur?: string; image?: string }>;
  };
}

export interface TVRow {
  id: string;
  title: string;
  apps: TVApp[];
}

export interface RemoteState {
  activeRowIndex: number;
  activeAppIndex: number;
  launchedApp: TVApp | null; // currently running "launched" app modal
}
