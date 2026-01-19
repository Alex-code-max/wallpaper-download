import { useCallback, useEffect, useState } from "react";
import UpdateElectron from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";
import "./App.css";
import Masonry from "./components/masonry";
import LazyImage from "./components/LazyImage";
import { imagePreloader } from "./utils/imagePreloader";

function App() {
  const [count, setCount] = useState(0);
  const [picList, setPicList] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getFreshPic = useCallback(async (currentPage: number) => {
    if (isLoading) return;
    setIsLoading(true);
    setHasNextPage(false);
    try {
      const data = (await window.api.fetchWallpapers(currentPage)) || [];
      setHasNextPage(data.length === 10);
      const res = data.map((item: any) => ({
        src: item.urls.full,
        alt: item.description,
      }));
      setPicList((prevList) => {
        const newList = [...prevList, ...res];
        // 预加载新添加的图片
        const newSrcs = res.map(item => item.src);
        imagePreloader.preloadBatch(newSrcs).catch(() => {
          // 忽略预加载错误
        });
        return newList;
      });
    } catch (err) {
      console.log(err);
      setHasNextPage(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const fetchNextPage = useCallback(() => {
    if (!hasNextPage || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    getFreshPic(nextPage);
  }, [page, hasNextPage, isLoading, getFreshPic]);

  const handleDownload = useCallback(async (url: string) => {
    try {
      const savedPath = await window.electron.downloadImage(url);
      alert(`图片已保存到：${savedPath}`);
    } catch (err) {
      alert("下载失败: " + err);
    }
  }, []);

  // 初始化加载第一页数据
  useEffect(() => {
    if (picList.length === 0) {
      getFreshPic(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {/* {picList.map((item) => (
        <img className="pic" src={item.urls.full} alt="pic" />
      ))} */}
      <Masonry
        items={picList}
        columnCount={3}
        renderItem={(item, index) => (
          <LazyImage
            src={item.src}
            alt={item.alt || `Wallpaper ${index}`}
            onClick={() => handleDownload(item.src)}
          />
        )}
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
      />
      {/* <div className="logo-box">
        <a
          href="https://github.com/electron-vite/electron-vite-react"
          target="_blank"
        >
          <img
            src={logoVite}
            className="logo vite"
            alt="Electron + Vite logo"
          />
          <img
            src={logoElectron}
            className="logo electron"
            alt="Electron + Vite logo"
          />
        </a>
      </div>
      <h1>Electron + Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Electron + Vite logo to learn more
      </p>
      <div className="flex-center">
        Place static files into the<code>/public</code> folder{" "}
        <img style={{ width: "5em" }} src="./node.svg" alt="Node logo" />
      </div>

      <UpdateElectron /> */}
    </div>
  );
}

export default App;
