import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { kvgJs } from 'kanjivg-js/vite-plugin';

export default defineConfig({
	plugins: [
		sveltekit(),
		kvgJs(),
	]
});
