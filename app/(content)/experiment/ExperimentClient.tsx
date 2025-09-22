// app/(content)/experiment/ExperimentClient.tsx
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration for your frontend (public client)
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AAD_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AAD_TENANT_ID}`,
    // Redirect back to your site after login; defaults to current origin
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

  // Called when the Power BI JS library finishes loading
  const handleScriptLoaded = () => {
    const pbiClient = (window as any)['powerbi-client'];
    // Create a global Service instance, as the official Microsoft script does
    if (pbiClient && !(window as any).powerbi) {
      (window as any).powerbi = new pbiClient.service.Service(
        pbiClient.factories.hpmFactory,
        pbiClient.factories.wpmpFactory,
        pbiClient.factories.routerFactory,
      );
    }
    setScriptReady(true);
  };

  useEffect(() => {
    // Wait until the Power BI library is loaded
    if (!scriptReady) return;

    async function signInAndEmbed() {
      let upn = username;

      // Initialize the MSAL instance before making any calls
      await msalInstance.initialize();

      // Prompt the user to sign in if we don't already have their UPN
      if (!upn) {
        const loginResponse = await msalInstance.loginPopup({
          // Request the Power BI API scope and basic OpenID scopes
          scopes: [
            'https://analysis.windows.net/powerbi/api/.default',
            'openid',
            'profile',
          ],
          // Display the “Pick an account” screen
          prompt: 'select_account',
        });
        upn = loginResponse.account?.username ?? null;
        setUsername(upn);
      }

      // Abort if the user cancelled sign-in
      if (!upn) {
        console.error('User sign-in failed.');
        return;
      }

      // Request an embed token from your API, passing the signed-in user's UPN
      const res = await fetch('/api/powerbi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: upn }),
      });
      const { embedUrl, embedToken, reportId } = await res.json();

      // Build the embed configuration using the embed token
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

      // Embed the report into the page
      const service = (window as any).powerbi;
      service.embed(reportContainerRef.current!, config);
    }

    signInAndEmbed().catch((e) => {
      console.error('Sign-in or embedding failed', e);
    });
  }, [scriptReady, username]);

  return (
    <section className="px-4 md:px-12 lg:container lg:px-24 xl:px-32">
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
    </section>
  );
}
