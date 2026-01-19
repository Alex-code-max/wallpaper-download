import React, { useState, useRef, useEffect } from "react";
import "./lazy-image.css";
import { imagePreloader } from "@/utils/imagePreloader";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 提前预加载图片
    imagePreloader.preload(src).catch(() => {
      // 忽略预加载错误
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // 不立即disconnect，保持观察以便后续优化
          }
        });
      },
      {
        rootMargin: "800px 200px", // 大幅增加预加载范围：上下800px，左右200px
        threshold: [0, 0.1, 0.5, 1], // 多个阈值，更精确的触发
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => {
    if (imgRef.current) {
      setImageHeight(imgRef.current.offsetHeight);
    }
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className="lazy-image-container"
      onClick={onClick}
      style={{ 
        cursor: onClick ? "pointer" : "default",
        minHeight: imageHeight ? `${imageHeight}px` : "200px"
      }}
    >
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full min-h-[200px] rounded-lg" />
      )}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? "lazy-image-loaded" : "lazy-image-loading"}`}
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          onLoad={handleLoad}
          style={{ width: "100%", display: "block" }}
        />
      )}
    </div>
  );
};

export default LazyImage;