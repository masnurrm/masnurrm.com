// app/(content)/experiment/ExperimentClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function ExperimentClient() {
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleScriptLoaded = () => {
    const lib = (window as any)['powerbi-client'];
    // If the wrapper isn’t present, assign one
    if (lib && !(window as any).powerbi) {
      (window as any).powerbi = lib;
    }
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded) return;

    async function embedReport() {
      const res = await fetch('/api/powerbi');
      const { embedUrl, embedToken, reportId } = await res.json();

      // Get the raw SDK
      const pbiClient = (window as any)['powerbi-client'];
      // Pick up the enums
      const models = pbiClient.models;
      // Create a Service instance (this is what Microsoft’s wrapper normally does for you)
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
