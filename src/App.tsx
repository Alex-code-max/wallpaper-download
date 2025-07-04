import { useCallback, useEffect, useState } from "react";
import UpdateElectron from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";
import "./App.css";
import Masonry from "./components/masonry";

function App() {
  const [count, setCount] = useState(0);
  const [picList, setPicList] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const getFreshPic = async () => {
    if (!hasNextPage) return;
    console.log("page :>> ", page);
    setHasNextPage(false);
    try {
      const data = (await window.api.fetchWallpapers(page)) || [];
      setHasNextPage(data.length === 10);
      const res = data.map((item: any) => ({
        src: item.urls.full,
        alt: item.description,
      }));
      setPicList([...picList, ...res]);
    } catch (err) {
      console.log(err);
      setHasNextPage(true);
    }
  };

  const fetchNextPage = () => {
    setPage(page + 1);
    getFreshPic();
  };

  const handleDownload = async (url: string) => {
    try {
      const savedPath = await window.electron.downloadImage(url);
      alert(`图片已保存到：${savedPath}`);
    } catch (err) {
      alert("下载失败: " + err);
    }
  };

  return (
    <div className="App">
      {/* {picList.map((item) => (
        <img className="pic" src={item.urls.full} alt="pic" />
      ))} */}
      <Masonry
        items={picList}
        columnCount={3}
        renderItem={(item) => (
          <img
            src={item.src}
            alt={item.alt}
            style={{ width: "100%" }}
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
