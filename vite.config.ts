import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
		modules: {
			// css模块化 文件以.module.[css|less|scss]结尾
			generateScopedName: "[name]__[local]___[hash:base64:5]",
			hashPrefix: "prefix",
		},
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		proxy: {
			"/api": {
				changeOrigin: true,
				target: "http://localhost:8000",
				rewrite: (path) => path.replace(/\/api/, ""),
			},
		},
	},
});
