export {};

declare global {
  interface Window {
    api: {
      fetchWallpapers: (page: number) => Promise<any>;
      // 你还可以在这里添加更多方法
    };
    electron: {
      downloadImage: (url: string) => Promise<string>;
    };
  }
}
