// Vimeo Player API type declarations
// Reference: https://developer.vimeo.com/player/sdk

interface VimeoPlayer {
  ready(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  setVolume(volume: number): Promise<void>;
  setCurrentTime(seconds: number): Promise<void>;
  loadVideo(id: number): Promise<void>;
  destroy(): Promise<void>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  getVolume(): Promise<number>;
  getPaused(): Promise<boolean>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback?: (...args: unknown[]) => void): void;
}

interface VimeoPlayerConstructor {
  new (element: HTMLIFrameElement, options?: Record<string, unknown>): VimeoPlayer;
}

interface Window {
  Vimeo?: {
    Player: VimeoPlayerConstructor;
  };
}

// Custom events for cross-section audio sync
interface WindowEventMap {
  'mute-hero': CustomEvent;
  'mute-reels': CustomEvent;
}

// Vite env vars used in the project
interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}
