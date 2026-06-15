import { TVRow } from './types';

export const INITIAL_TV_ROWS: TVRow[] = [
  {
    id: 'world_cup_2026',
    title: '🏆 WORLD CUP 2026 - LIVE SPORTS CHANNELS',
    apps: [
      {
        id: 'cctv5_hd',
        name: 'CCTV5 HD',
        category: 'world_cup_2026',
        logoType: 'combined',
        iconName: 'Tv',
        bgColor: 'bg-[#181824]',
        fgColor: 'text-white',
        accentColor: '#FF1E1E',
        developer: 'CCTV Sports Network',
        rating: 4.9,
        description: 'China Central Television Sports Channel (CCTV5) HD. Stream live World Cup matches, athletic meetings, expert commentary, and real-time elite tournaments.',
        logoUrl: 'https://epg.v1.mk/logo/cctv5.png',
        streamUrl: 'http://38.75.136.137:98/gslb/dsdqpub/cctv5hd.m3u8?auth=testpub',
        simulatedContent: {
          title: 'CCTV-5 Sports HD',
          description: 'Live Satellite HLS IPTV Direct stream broadcast.',
          items: [
            { id: 'cctv5_feed', title: 'CCTV5 Live Stream Feed', subtitle: 'LIVE • International Tournament Coverage', dur: 'LIVE' }
          ]
        }
      },
      {
        id: 'elta_sport_1',
        name: 'ELTA Sport 1',
        category: 'world_cup_2026',
        logoType: 'combined',
        iconName: 'Play',
        bgColor: 'bg-[#101E2E]',
        fgColor: 'text-white',
        accentColor: '#0EA5E9',
        developer: 'ELTA TV Taiwan',
        rating: 4.8,
        description: 'ELTA Sports TV Channel 1 HD direct live network stream. Immersive sports coverage including international football tournaments, athletics, and commentary.',
        logoUrl: 'https://piceltaott-elta.cdn.hinet.net/upload/channel/101_a4004c6c910cbec6345fa2015981ebd7.png',
        streamUrl: 'https://drmteste-hamivideo.cdn.hinet.net/live/pool/ll-test-hevc/hls-cl-fhd6m-4s-ma/index.m3u8?0',
        simulatedContent: {
          title: 'ELTA Sports 1 HD',
          description: 'High-speed premium optical local broadcast stream.',
          items: [
            { id: 'elta_feed', title: 'ELTA Sport 1 Live Feed', subtitle: 'LIVE • High Definition Sports Streaming Arena', dur: 'LIVE' }
          ]
        }
      }
    ]
  }
];
