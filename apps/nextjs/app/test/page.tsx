'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function TestPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Set a test pimms_id cookie so extensions have something to work with
    document.cookie = 'pimms_id=test_click_id_123; path=/; SameSite=Lax';
    setReady(true);
  }, []);

  if (!ready) return <p>Setting up cookies...</p>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 40, maxWidth: 800 }}>
      <h1>PIMMS Script Test Page</h1>
      <p>
        Cookie set: <code>pimms_id=test_click_id_123</code>
      </p>

      <hr />

      <h2>1. Outbound Links (hypothesis B)</h2>
      <p>
        These links should get <code>?pimms_id=test_click_id_123</code>{' '}
        appended:
      </p>
      <ul>
        <li>
          <a href="https://tally.so/r/test-form" id="tally-link">
            Tally Form Link
          </a>
        </li>
        <li>
          <a href="https://cal.com/team/meeting" id="cal-link">
            Cal.com Link
          </a>
        </li>
      </ul>

      <h2>2. Embed Attributes (hypothesis C)</h2>
      <p>
        These should get <code>pimms_id</code> appended to their attribute
        value:
      </p>
      <div id="tally-embed" data-tally-src="https://tally.so/embed/test-form">
        [data-tally-src element]
      </div>
      <div id="cal-embed" data-cal-link="team/standup">
        [data-cal-link element - relative path, should NOT match unless cal.com
        is outbound]
      </div>

      <h2>3. Srcdoc (hypothesis D)</h2>
      <iframe
        id="srcdoc-test"
        srcDoc='<html><body><a href="https://tally.so/r/embedded-form">Link inside srcdoc</a></body></html>'
        style={{ width: '100%', height: 100, border: '1px solid #ccc' }}
      />

      <h2>4. Detect IDs — non-outbound domain with pimms_id=1</h2>
      <p>
        These links have <code>pimms_id=1</code> placeholder on domains NOT in
        outbound config. They should still get replaced:
      </p>
      <ul>
        <li>
          <a href="https://example.com/checkout?pimms_id=1" id="detect-link">
            example.com with pimms_id=1
          </a>
        </li>
        <li>
          <a
            href="https://my-custom-app.io/signup?ref=abc&pimms_id=1&extra=1"
            id="detect-link-2"
          >
            my-custom-app.io with pimms_id=1 (mid-query)
          </a>
        </li>
      </ul>

      <h2>5. Thank-you Page</h2>
      <p>
        Visit <a href="/thanks/demo">/thanks/demo</a> to test the thank-you
        fetch.
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
