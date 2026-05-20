import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Global keyboard shortcuts for the application.
 * F1 = Dashboard, F2 = POS, F3 = Orders, F4 = Kitchen
 * Alt+N = New Order (go to POS), Alt+H = Hold current page
 */
export function KeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      // F-key navigation
      if (e.key === 'F1') { e.preventDefault(); navigate('/dashboard'); }
      if (e.key === 'F2') { e.preventDefault(); navigate('/pos'); }
      if (e.key === 'F3') { e.preventDefault(); navigate('/orders'); }
      if (e.key === 'F4') { e.preventDefault(); navigate('/kitchen'); }
      if (e.key === 'F5') { e.preventDefault(); navigate('/tables'); }
      if (e.key === 'F6') { e.preventDefault(); navigate('/products'); }

      // Alt shortcuts
      if (e.altKey && e.key === 'n') { e.preventDefault(); navigate('/pos'); }
      if (e.altKey && e.key === 'r') { e.preventDefault(); navigate('/reports'); }
      if (e.altKey && e.key === 's') { e.preventDefault(); navigate('/settings'); }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return null;
}
