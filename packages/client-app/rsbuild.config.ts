import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    inject: 'head',
    tags: [
      {
        tag: 'script',
        attrs: {
          src: 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.2/libs/cn/index.js',
        },
      },
    ],
  },
});
