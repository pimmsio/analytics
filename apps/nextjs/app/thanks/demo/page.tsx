'use client';

import Script from 'next/script';

export default function ThanksPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 40 }}>
      <h1>Thank You Page (/thanks/demo)</h1>
      <p>The thank-you fetch should fire automatically on this page.</p>
      <p>Check logs for hypothesis E.</p>
      <p>
        <a href="/test">Back to test page</a>
      </p>

      <Script
        src="/script.detection.js"
        data-domains={JSON.stringify({
          outbound: 'tally.so,cal.com',
          'thank-you': 'https://pim.ms/test-thank-you',
        })}
      />
    </div>
  );
}
