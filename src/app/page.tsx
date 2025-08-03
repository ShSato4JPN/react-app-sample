"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーション後にのみレンダリング
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">テーマ切り替えテスト</h1>
      <p className="mb-4">現在のテーマ: <span className="font-semibold">{theme}</span></p>
      <div className="space-x-4 mb-8">
        <button 
          onClick={() => setTheme("light")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ライトモード
        </button>
        <button 
          onClick={() => setTheme("dark")}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          ダークモード
        </button>
        <button 
          onClick={() => setTheme("system")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          システム設定
        </button>
      </div>
      <div className="bg-test p-4 rounded">
        テストエリア - 背景色が変わることを確認
      </div>
    </div>
  );
}
