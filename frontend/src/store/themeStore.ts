import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: () => boolean;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },
      isDark: () => {
        const t = get().theme;
        return t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      },
    }),
    { name: 'mypos-theme' }
  )
);

// Initialize on load
if (typeof window !== 'undefined') {
  const stored = JSON.parse(localStorage.getItem('mypos-theme') || '{}');
  applyTheme(stored?.state?.theme || 'light');
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const t = useThemeStore.getState().theme;
    if (t === 'system') applyTheme('system');
  });
}
