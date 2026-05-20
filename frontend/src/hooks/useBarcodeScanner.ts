import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect barcode scanner input.
 * Barcode scanners type characters rapidly (< 50ms between keystrokes)
 * and end with Enter. This hook distinguishes scanner input from typing.
 */
export function useBarcodeScanner(onScan: (barcode: string) => void, enabled = true) {
  const buffer = useRef('');
  const lastKeyTime = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input/textarea (unless it's the search field)
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA') return;
    if (target.tagName === 'INPUT' && target.getAttribute('data-barcode-target') !== 'true') return;

    const now = Date.now();
    const timeDiff = now - lastKeyTime.current;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (buffer.current.length >= 4) { // Barcodes are usually 4+ chars
        onScan(buffer.current);
      }
      buffer.current = '';
      if (timeout.current) clearTimeout(timeout.current);
      return;
    }

    // Only track printable characters
    if (e.key.length === 1) {
      // If too much time passed, reset buffer (user is typing manually)
      if (timeDiff > 100 && buffer.current.length > 0) {
        buffer.current = '';
      }
      buffer.current += e.key;
      lastKeyTime.current = now;

      // Auto-reset buffer after 500ms of no input
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => { buffer.current = ''; }, 500);
    }
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [handleKeyDown, enabled]);
}
