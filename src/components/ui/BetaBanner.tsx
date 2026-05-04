'use client';

import { useState } from 'react';

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="beta-banner d-flex align-items-center justify-content-between px-3 py-2">
      <span>
        ▸ ikzienix β — Early access. 25 pairs. No patches yet.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="btn btn-sm p-0 border-0 ms-3"
        style={{ background: 'transparent', lineHeight: 1 }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
