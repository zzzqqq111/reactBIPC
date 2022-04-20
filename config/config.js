// https://umijs.org/config/
import os from 'os';
// import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const { primaryColor } = defaultSettings;
const { APP_TYPE, TEST, PUBLIC_URL = '/', BASE_URL = '/' } = process.env;

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
        dynamicImport: undefined,
      },
      routes: {
        exclude: [/models\//, /components\//, /services\//, /model.js/],
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];
// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
// if (APP_TYPE === 'site') {
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
// }

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
    CODE_ENV:process.env.CODE_ENV ||'',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  // routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },

  // target - beta: 'https://biw.yunchuangfu.com/',
  // target - release: 'https://biw.meiguipai.net/',
  // target - production: 'https://biw.baie.com.cn/',

  proxy: {
    '/api/p': {
      target: 'https://biw.baie.com.cn/',
      changeOrigin: true,
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  outputPath: './build',
  publicPath: process.env.PUBLIC_URL||`https://fe-site-${process.env.CODE_ENV}-${process.env.TENCENT_APP_ID}.file.myqcloud.com/${process.env.PROJECT_NAME}/`,
  chainWebpack: webpackPlugin,
  hash: true,
};
