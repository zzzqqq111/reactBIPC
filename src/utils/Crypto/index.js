/**
 @description: 未命名
 @date: 2018/12/7
 @author: Buggy(chenyuanhui@baie.com.cn)
 */
import { Sign as SignBeta } from './beta-min';
import { Sign as SignRel } from './release-min';
import { Sign as SignProduct } from './reactWeb-production-min';
import { packageInfo } from '../../constants/AppEnv';

const env=packageInfo.env
/* eslint import/no-mutable-exports: off */
let signature = SignProduct;

if (env === 'beta') {
  signature = SignBeta;
}

if (env === 'release') {
  signature = SignRel;
}

export default signature;
