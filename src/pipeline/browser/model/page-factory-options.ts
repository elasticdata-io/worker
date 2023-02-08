export interface PageFactoryOptions {
  windowWidth: number;
  windowHeight: number;
  language: string;
  proxies: string[];
  network: {
    skipResources: {
      stylesheet: boolean;
      image: boolean;
      font: boolean;
    };
  };
}
