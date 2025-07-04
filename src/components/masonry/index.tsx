import React, { useEffect, useState, useRef, useCallback } from "react";

interface MasonryProps<T> {
  items: T[];
  columnCount?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gap?: number;
  loadMore?: () => void; // 👈 新增
  hasMore?: boolean; // 👈 新增
}

function Masonry<T>({
  items,
  columnCount = 3,
  renderItem,
  gap = 16,
  loadMore,
  hasMore = false,
}: MasonryProps<T>) {
  const [columns, setColumns] = useState<T[][]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 分列逻辑
  useEffect(() => {
    const colArray: T[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, idx) => {
      const colIndex = idx % columnCount;
      colArray[colIndex].push(item);
    });
    setColumns(colArray);
  }, [items, columnCount]);

  // IntersectionObserver 回调
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && loadMore && hasMore) {
        loadMore();
      }
    },
    [loadMore, hasMore]
  );

  // 启动 observer
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <>
      <div style={{ display: "flex", gap: `${gap}px` }}>
        {columns.map((column, colIdx) => (
          <div
            key={colIdx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: `${gap}px`,
            }}
          >
            {column.map((item, idx) => (
              <div key={idx}>{renderItem(item, idx)}</div>
            ))}
          </div>
        ))}
      </div>
      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </>
  );
}

export default Masonry;
