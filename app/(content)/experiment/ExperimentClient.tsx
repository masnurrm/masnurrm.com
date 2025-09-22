// app/(content)/experiment/ExperimentClient.tsx
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import Script from 'next/script';
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AAD_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AAD_TENANT_ID}`,
    redirectUri:
      process.env.NEXT_PUBLIC_AAD_REDIRECT_URI || window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default function ExperimentClient() {
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);

  const handleScriptLoaded = () => {
    const pbiClient = (window as any)['powerbi-client'];
    if (pbiClient && !(window as any).powerbi) {
      (window as any).powerbi = new pbiClient.service.Service(
        pbiClient.factories.hpmFactory,
        pbiClient.factories.wpmpFactory,
        pbiClient.factories.routerFactory,
      );
    }
    setScriptReady(true);
  };

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
    const res = await fetch('/api/powerbi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: upn }),
    });
    const { embedUrl, embedToken, reportId } = await res.json();
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
    service.reset(reportContainerRef.current!);
    service.embed(reportContainerRef.current!, config);
    setIsEmbedded(true);
  }

  const handleViewData = () => {
    signInAndEmbed(false).catch((e) => console.error('Embedding failed', e));
  };

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
