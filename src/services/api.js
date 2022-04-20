// import { stringify } from 'qs';
import request from '@/utils/request';
import FetchURL from './FetchURL';

export async function fakeAccountLogin(params) {
  // 登陆
  return request(FetchURL.login, {
    method: 'POST',
    body: params,
  });
}

export async function getFakeCaptcha(params) {
  // 获取验证码
  return request('https://nodeapi.rosepie.com/api/v1/code/captchaSms', {
    method: 'GET',
    body: params,
  });
}

export async function getDistrict() {
  // 获取地区信息
  return request(FetchURL.getDistrict, {
    method: 'GET',
  });
}

export async function queryProduct() {
  // 获取产品列表
  return request(FetchURL.queryProduct, {
    method: 'GET',
  });
}

export async function queryTeamtag() {
  // 获取市场列表
  return request(FetchURL.queryTeamtag, {
    method: 'GET',
  });
}

export async function getMenus(params) {
  // 获取菜单
  return new Promise((resolve, reject) => {
    if (params.father === 'orderDetail') {
      resolve([
        {
          title: '交易明细',
          id: 'detail',
          subMenus: [
            { title: '订货明细', id: 'order' },
            { title: '发货明细', id: 'shipment' },
            { title: '动销明细', id: 'clearingIndex' },
            { title: '退款明细', id: 'refundment' },
          ],
        },
      ]);
    } else {
      reject();
    }
  });
}

export async function queryDownloadRecord() {
  // 获取下载记录
  return request(FetchURL.downloadQueryDownloadRecord, {
    method: 'GET',
  });
}

export async function downloadSave(params) {
  // 下载记录增加
  return request(FetchURL.downloadSave, {
    method: 'POST',
    body: params,
  });
}

export async function downloadDelete(params) {
  // 下载记录删除
  return request(FetchURL.downloadDelete, {
    method: 'POST',
    body: params,
  });
}

export async function fileSign(params) {
  return request(FetchURL.sign, {
    method: 'GET',
    body: params,
  });
}

export async function fileUploadSign(params) {
  return request(FetchURL.signUpload, {
    method: 'GET',
    body: params,
  });
}

export async function fileSignPublic(params) {
  return request(FetchURL.signPublic, {
    method: 'GET',
    body: params,
  });
}
