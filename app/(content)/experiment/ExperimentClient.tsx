'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import Script from 'next/script';
import { PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration for the frontend login
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AAD_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AAD_TENANT_ID}`,
    redirectUri:
      process.env.NEXT_PUBLIC_AAD_REDIRECT_URI || window.location.origin,
  },
};

// Instantiate the MSAL public client once
const msalInstance = new PublicClientApplication(msalConfig);

export default function ExperimentClient() {
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);

  /**
   * Called when the Power BI JS library finishes loading. This method
   * creates a global service instance if needed and bootstraps the
   * report container. Bootstrapping prepares the iframe ahead of time
   * so that actual embedding is faster【15450434017603†L284-L295】.
   */
  const handleScriptLoaded = () => {
    const pbiClient = (window as any)['powerbi-client'];
    // Create a global Service instance (same as the official library)
    if (pbiClient && !(window as any).powerbi) {
      (window as any).powerbi = new pbiClient.service.Service(
        pbiClient.factories.hpmFactory,
        pbiClient.factories.wpmpFactory,
        pbiClient.factories.routerFactory,
      );
    }
    // Bootstrap the iframe with minimal config. This downloads and caches
    // resources and prepares the iframe, improving perceived load time.
    const service = (window as any).powerbi;
    const container = reportContainerRef.current;
    if (service && container) {
      try {
        // Use type 'report'; hostname defaults to https://app.powerbi.com
        service.bootstrap(container, { type: 'report' });
      } catch (e) {
        console.warn('Bootstrap failed', e);
      }
    }
    setScriptReady(true);
  };

  /**
   * Signs in (or re‑signs in) and embeds the report. When forceSignIn is true,
   * it always prompts the account picker even if a user is already signed in.
   */
  async function signInAndEmbed(forceSignIn = false) {
    if (!scriptReady) return;
    await msalInstance.initialize();
    let upn = username;
    if (!upn || forceSignIn) {
      const loginResponse = await msalInstance.loginPopup({
        scopes: [
          'https://analysis.windows.net/powerbi/api/.default',
          'openid',
          'profile',
        ],
        prompt: 'select_account',
      });
      upn = loginResponse.account?.username ?? null;
      setUsername(upn);
    }
    if (!upn) {
      console.error('User sign-in failed.');
      return;
    }
    // Check whether embed URL and report ID are cached in sessionStorage.
    // These values are static per report; caching them avoids unnecessary
    // recomputation on the client. Embed tokens are NOT cached because they
    // are user-specific and short-lived.
    let embedUrl = sessionStorage.getItem('pbiEmbedUrl');
    let reportId = sessionStorage.getItem('pbiReportId');

    // Always call the API to get a fresh embed token with the effective
    // identity. The API also returns embedUrl and reportId. If these values
    // are not cached, store them after the call.
    const res = await fetch('/api/powerbi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: upn }),
    });
    const {
      embedUrl: embedUrlResp,
      embedToken,
      reportId: reportIdResp,
    } = await res.json();

    // Update embedUrl and reportId variables
    embedUrl = embedUrlResp;
    reportId = reportIdResp;

    // Cache embedUrl and reportId for subsequent loads
    if (embedUrl && reportId) {
      sessionStorage.setItem('pbiEmbedUrl', embedUrl);
      sessionStorage.setItem('pbiReportId', reportId);
    }

    const pbiClient = (window as any)['powerbi-client'];
    const models = pbiClient.models;
    const config = {
      type: 'report',
      id: reportId,
      embedUrl,
      accessToken: embedToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true },
        },
      },
    };
    const service = (window as any).powerbi;
    // Reset any existing embed and embed the report using the new config
    service.reset(reportContainerRef.current!);
    service.embed(reportContainerRef.current!, config);
    setIsEmbedded(true);
  }

  // Handler for the initial “View Data” button
  const handleViewData = () => {
    signInAndEmbed(false).catch((e) => console.error('Embedding failed', e));
  };

  // Handler for the “Switch User” button
  const handleRelog = () => {
    signInAndEmbed(true).catch((e) =>
      console.error('Re-login or embedding failed', e),
    );
  };

  return (
    // Wider container: adjust max-w-* to control how wide the report can be
    <section className="w-full max-w-4xl mx-auto px-4 md:px-12">
      <h1 className="mb-4 text-4xl font-bold md:text-6xl">Experiment</h1>
      <p className="mb-4 text-muted-foreground">
        This page demonstrates an embedded Power&nbsp;BI report with Microsoft
        login.
      </p>
      {/* Load the Power BI client library from a CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/powerbi-client/2.23.1/powerbi.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoaded}
      />
      <div
        ref={reportContainerRef}
        className="h-[600px] w-full rounded border"
      />
      {!isEmbedded && (
        <button
          onClick={handleViewData}
          // Pastel blue button with contrasting text
          className="w-full mx-auto mt-2 mb-4 rounded bg-blue-50 px-4 py-2 font-semibold text-blue-800 hover:bg-blue-100 hover:text-blue-900"
        >
          View Data
        </button>
      )}
      {isEmbedded && (
        <button
          onClick={handleRelog}
          className="w-full mx-auto mt-2 mb-4 rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
        >
          Switch User
        </button>
      )}
    </section>
  );
}
