// types/powerbi-client.d.ts
declare interface PowerBIClient {
  models: {
    TokenType: { Embed: unknown };
  };
  service: {
    Service: new (
      hpmFactory: unknown,
      wpmpFactory: unknown,
      routerFactory: unknown,
    ) => {
      embed: (element: HTMLElement, config: unknown) => void;
    };
  };
  factories: {
    hpmFactory: unknown;
    wpmpFactory: unknown;
    routerFactory: unknown;
  };
}
