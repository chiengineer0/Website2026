// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pwa from '@vite-pwa/astro';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'node:url';

const site = 'https://chiengineer0.github.io';
const base = '/Website2026';

export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	prefetch: {
		prefetchAll: true,
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
		},
	},
	integrations: [
		react(),
		mdx(),
		sitemap(),
		pwa({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'offline.html'],
			manifest: {
				name: '[BRAND NAME] Electric',
				short_name: 'BRAND Electric',
				description: 'Premium residential and commercial electrical contractor services.',
				theme_color: '#0D0D0D',
				background_color: '#0D0D0D',
				display: 'standalone',
				start_url: `${base}/`,
				scope: `${base}/`,
				icons: [
					{
						src: `${base}/icons/icon.svg`,
						sizes: 'any',
						type: 'image/svg+xml',
					},
					{
						src: `${base}/icons/icon-maskable.svg`,
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'maskable',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,webp,avif,woff2}'],
				navigateFallback: `${base}/offline.html`,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\./i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'font-cache',
							expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
						},
					},
				],
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	vite: {
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		plugins: [tailwindcss(), imagetools()],
		build: {
			rollupOptions: {
				plugins: [
					visualizer({
						filename: 'dist/bundle-analysis.html',
						gzipSize: true,
						brotliSize: true,
						open: false,
					}),
				],
			},
		},
	},
});
