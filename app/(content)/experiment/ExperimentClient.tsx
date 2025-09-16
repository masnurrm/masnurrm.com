// app/(content)/experiment/ExperimentClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    'powerbi-client': PowerBIClient;
  }
}

export default function ExperimentClient() {
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleScriptLoaded = () => {
    const lib = window['powerbi-client'];
    if (lib && !window.powerbi) {
      window.powerbi = lib as any; // one cast here is typically allowed or can be suppressed
    }
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded) return;

    async function embedReport() {
      const res = await fetch('/api/powerbi');
      const { embedUrl, embedToken, reportId } = await res.json();

      // Get the raw SDK
      const pbiClient = window['powerbi-client'];
      const models = pbiClient.models;
      const service = new pbiClient.service.Service(
        pbiClient.factories.hpmFactory,
        pbiClient.factories.wpmpFactory,
        pbiClient.factories.routerFactory,
      );

      const config = {
        type: 'report',
        id: reportId,
        embedUrl,
        tokenType: models.TokenType.Embed,
        accessToken: embedToken,
      };

      service.embed(reportContainerRef.current!, config);
    }

    embedReport();
  }, [loaded]);

  return (
    <section className="px-4 md:px-12 lg:container lg:px-24 xl:px-32">
      <h1 className="mb-4 text-4xl font-bold md:text-6xl">Experiment</h1>
      <p className="mb-4 text-muted-foreground">
        This page demonstrates an embedded Power&nbsp;BI report using the
        App‑Owns‑Data model.
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
    </section>
  );
}
