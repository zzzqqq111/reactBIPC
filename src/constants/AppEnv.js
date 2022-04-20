
let sever_env = 'production' //本地开发时，指定对应的接口环境

if (process.env.CODE_ENV) {
  // sls  deploy 用
  //config/env.js  getClientEnvironment 方法内注入的，npm run sls会从 /.env 文件中读取
  sever_env = process.env.CODE_ENV
}

export const packageInfo={
  version:"3.6.0",
  env:sever_env,
  build:"1600935442628",
}

export const IS_BETA = packageInfo.env === 'beta'
export const IS_REL = packageInfo.env === 'rel' || packageInfo.env === 'release'
export const IS_PRE_PRODUCTION = packageInfo.env === 'pre_production'
export const IS_PRODUCTION = packageInfo.env === 'production'
