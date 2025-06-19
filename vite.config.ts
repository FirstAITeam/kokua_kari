import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { spawn } from "child_process";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 開発モードの場合、バックエンドサーバーを起動
  if (mode === 'development') {
    const backendServer = spawn('node', ['server.js'], {
      stdio: 'inherit',
      shell: true
    });

    // プロセス終了時にバックエンドサーバーも終了させる
    process.on('exit', () => {
      backendServer.kill();
    });

    // SIGINT（Ctrl+C）を受け取ったときにバックエンドサーバーも終了させる
    process.on('SIGINT', () => {
      backendServer.kill();
      process.exit();
    });
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // APIリクエストをバックエンドサーバーにプロキシ
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
