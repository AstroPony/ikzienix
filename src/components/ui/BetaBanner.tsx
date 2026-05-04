'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ikzienix_banner_dismissed';

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="beta-banner d-flex align-items-center justify-content-between px-3 py-2">
      <span>
        ▸ ikzienix β — Early access. 25 pairs. No patches yet.
      </span>
      <button
        onClick={dismiss}
        className="btn btn-sm p-0 border-0 ms-3"
        style={{ background: 'transparent', lineHeight: 1 }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
