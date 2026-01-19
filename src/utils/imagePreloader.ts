/**
 * 图片预加载工具
 * 用于提前加载即将显示的图片，减少滚动时的空白
 */

class ImagePreloader {
  private preloadQueue: Set<string> = new Set();
  private loadedImages: Map<string, HTMLImageElement> = new Map();
  private maxConcurrent: number = 6; // 最大并发加载数
  private currentLoading: number = 0;

  /**
   * 预加载图片
   */
  preload(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 如果已经加载过，直接返回
      if (this.loadedImages.has(src)) {
        resolve();
        return;
      }

      // 如果正在加载队列中，等待
      if (this.preloadQueue.has(src)) {
        // 可以添加一个等待机制，但为了简化，这里直接返回
        resolve();
        return;
      }

      // 如果达到最大并发数，加入队列
      if (this.currentLoading >= this.maxConcurrent) {
        this.preloadQueue.add(src);
        // 延迟重试
        setTimeout(() => {
          this.preload(src).then(resolve).catch(reject);
        }, 100);
        return;
      }

      this.currentLoading++;
      const img = new Image();
      
      img.onload = () => {
        this.loadedImages.set(src, img);
        this.currentLoading--;
        this.preloadQueue.delete(src);
        
        // 处理队列中的下一个
        this.processQueue();
        resolve();
      };

      img.onerror = () => {
        this.currentLoading--;
        this.preloadQueue.delete(src);
        this.processQueue();
        reject(new Error(`Failed to load image: ${src}`));
      };

      // 设置优先级和异步解码
      (img as any).fetchPriority = 'high';
      (img as any).decoding = 'async';
      
      img.src = src;
    });
  }

  /**
   * 批量预加载图片
   */
  async preloadBatch(srcs: string[]): Promise<void> {
    const promises = srcs.map(src => this.preload(src).catch(() => {
      // 忽略单个图片加载失败
    }));
    await Promise.all(promises);
  }

  /**
   * 处理预加载队列
   */
  private processQueue(): void {
    if (this.preloadQueue.size === 0 || this.currentLoading >= this.maxConcurrent) {
      return;
    }

    const nextSrc = Array.from(this.preloadQueue)[0];
    if (nextSrc) {
      this.preload(nextSrc).catch(() => {
        // 忽略错误
      });
    }
  }

  /**
   * 获取已加载的图片
   */
  getLoadedImage(src: string): HTMLImageElement | undefined {
    return this.loadedImages.get(src);
  }

  /**
   * 清理缓存
   */
  clear(): void {
    this.preloadQueue.clear();
    this.loadedImages.clear();
    this.currentLoading = 0;
  }
}

export const imagePreloader = new ImagePreloader();