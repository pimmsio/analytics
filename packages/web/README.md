# @getpimms/analytics

Easily track and optimize your lead and sales conversions using PIMMS across multiple channels and applications.

## Overview

`@getpimms/analytics` provides a streamlined way to implement conversion tracking on your site or application, helping you identify exactly what generates your leads and conversions.

## Quick Start

Follow these steps to quickly integrate PIMMS analytics:

### 1. Enable Conversion Tracking

Activate conversion tracking for your PIMMS links via the [PIMMS dashboard](https://app.pimms.io).

### 2. Install the Analytics Package

Add the `@getpimms/analytics` package to your project:

```bash
npm install @getpimms/analytics
```

### 3. Inject the Analytics Script

Integrate the tracking script into your application:

**React Example:**

```tsx
import { Analytics as PimmsAnalytics } from '@getpimms/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <PimmsAnalytics />
    </html>
  );
}
```

Alternatively, for other frameworks, use the `inject()` method.

## CDN Scripts

All scripts are available via CDN at `https://cdn.pimms.io/analytics/`.

### Available Bundles

| Script | Includes | Use case |
|--------|----------|----------|
| `script.js` | Base tracking | Minimal click tracking only |
| `script.site-visit.js` | Base + site visit | Track anonymous site visits |
| `script.outbound-domains.js` | Base + outbound domains | Cross-domain `pimms_id` on outbound links |
| `script.site-visit.outbound-domains.js` | Base + site visit + outbound domains | Both visit tracking and outbound links |
| `script.detection.js` | Base + outbound domains + detect IDs + embed support + thank-you page | Detection and conversion tracking bundle |
| `script.expose.js` | Expose IDs only | Sets `window.pimms_id` from cookie/URL (standalone, no base) |
| `script.inject-form.js` | Form injection only | Injects hidden `pimms_id` into all forms (standalone, no base) |

### Recommended: Detection Bundle

For most use cases, the detection bundle gives you everything in a single script tag:

```html
<script
  defer
  src="https://cdn.pimms.io/analytics/script.detection.js"
  data-domains='{
    "refer": "your-short.domain",
    "site": "your-site.domain",
    "outbound": "tally.so,cal.com"
  }'>
</script>
```

## Available Props

Customize the analytics script by passing props to the `Analytics` component or as `data-*` attributes on the script tag.

### `apiHost`

Defines a custom API host for tracking requests. Useful when using reverse proxies to bypass ad-blockers.

- **Default:** `https://api.pimms.io`
- **Script attribute:** `data-api-host`

### `domainsConfig`

Configure domains and features via a single JSON object. Passed as `data-domains` on the script tag.

```tsx
<PimmsAnalytics
  domainsConfig={{
    refer: "pim.ms",
    site: "site.pimms.io",
    outbound: "tally.so,cal.com",
  }}
/>
```

**Available keys:**

| Key | Type | Description |
|-----|------|-------------|
| `refer` | `string` | PIMMS short domain for referral click tracking |
| `site` | `string` | PIMMS short domain for anonymous site visit tracking |
| `outbound` | `string` | Comma-separated list of domains. `pimms_id` is auto-appended to all outbound `<a>` links matching these domains |
| `embed` | `object` | Embed support configuration (see below) |
| `thank-you` | `string` | PIMMS short link to fetch on `/thanks/` pages (see below) |

### Outbound Domains

When `outbound` is configured, all `<a>` links whose `href` matches one of the listed domains will automatically get `?pimms_id=...` appended. This enables cross-domain tracking without manual URL changes.

```html
<script
  defer
  src="https://cdn.pimms.io/analytics/script.detection.js"
  data-domains='{"outbound": "tally.so,cal.com"}'>
</script>
```

### Embed Support

The embed extension auto-appends `pimms_id` to embed widget attributes (e.g. `data-tally-src`, `data-cal-link`) and inside `srcdoc` HTML content, for any URL matching an `outbound` domain.

**Defaults:** targets `data-cal-link` and `data-tally-src` attributes. Customize via `embed.attributes`:

```html
<script
  defer
  src="https://cdn.pimms.io/analytics/script.detection.js"
  data-domains='{
    "outbound": "tally.so,cal.com",
    "embed": {
      "attributes": ["data-tally-src", "data-cal-link", "data-custom-src"]
    }
  }'>
</script>
```

For `<iframe srcdoc="...">` content, any URL matching an outbound domain is automatically updated. No extra config needed.

### Thank-You Page

When enabled, the script fires a one-time `GET` fetch to a PIMMS short link (per session, per path) on pages under `/thanks/`. This triggers a conversion event server-side.

Enable by setting `thank-you` to a PIMMS short link:

```html
<script
  defer
  src="https://cdn.pimms.io/analytics/script.detection.js"
  data-domains='{
    "outbound": "tally.so",
    "thank-you": "https://pim.ms/your-thank-you-link"
  }'>
</script>
```

The fetch uses `mode: "no-cors"`, `credentials: "include"`, and `keepalive: true`. It fires once per `/thanks/*` path per browser session (deduplicated via `sessionStorage`).

### Detect IDs

Automatically replaces placeholder values in links to official integrations:

- **Cal.com** (`*.cal.com`): adds `pimms_id`
- **Stripe Checkout** (`buy.stripe.com`): adds `client_reference_id`
- **iClosed** (`*.iclosed.io`): adds `utm_term`

Also replaces `pimms_id=1` placeholders in any link with the real `pimms_id` value.

When `data-forward-all="true"` is set, `pimms_id` is appended to all same-domain links as well.

### `attributionModel`

Defines which touchpoint receives conversion credit:

- **Default:** `last-click`
- **Script attribute:** `data-attribution-model`

Available options:
- `first-click`: Credits the initial user interaction.
- `last-click`: Credits the final user interaction.

```tsx
<PimmsAnalytics attributionModel="first-click" />
```

### `cookieOptions`

Customize the cookie behavior for tracking:

| Key | Default | Description | Example |
|-----|---------|-------------|---------|
| `domain` | `null` | Domain scope of the cookie | `example.com` |
| `expires` | 90 days from now | Explicit expiry date | `new Date('2024-12-31')` |
| `expiresInDays` | `90` | Number of days before the cookie expires | `60` |
| `path` | `/` | URL path the cookie applies to | `/` |

- **Script attribute:** `data-cookie-options` (JSON string)

```tsx
<PimmsAnalytics cookieOptions={{ expiresInDays: 60 }} />
```

### `queryParam`

Specifies the URL parameter to use for tracking (e.g., referral codes):

- **Default:** `via`
- **Script attribute:** `data-query-param`

```tsx
<PimmsAnalytics queryParam="ref" />
```

### `scriptProps`

Custom attributes for the injected `<script>` tag. See [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement) for all available options.

```tsx
<PimmsAnalytics scriptProps={{ defer: true }} />
```

## Standalone Scripts

These scripts work independently (no base tracking required):

### `script.expose.js`

Reads `pimms_id` from cookies or URL and exposes it as `window.pimms_id`.

```html
<script src="https://cdn.pimms.io/analytics/script.expose.js"></script>
<script>
  console.log(window.pimms_id); // the pimms_id value or null
</script>
```

### `script.inject-form.js`

Injects a hidden `<input name="pimms_id">` into all `<form>` elements on the page. Watches for dynamically added forms via MutationObserver.

```html
<script src="https://cdn.pimms.io/analytics/script.inject-form.js"></script>
```

## Full Example (Detection Bundle)

```html
<script
  defer
  src="https://cdn.pimms.io/analytics/script.detection.js"
  data-domains='{
    "refer": "go.example.com",
    "site": "site.example.com",
    "outbound": "tally.so,cal.com",
    "thank-you": "https://api.example.com/convert"
  }'
  data-attribution-model="last-click"
  data-query-param="via">
</script>
```

This single script tag enables: click tracking, outbound link tracking, embed support for Tally/Cal, link detection for Stripe/Cal/iClosed, and thank-you page conversion callbacks.

## Next Steps

[Sign up for PIMMS today](https://app.pimms.io/register)

[Introduction to conversion tracking | blog](https://pimms.io/blog/introducing-conversion-tracking)
