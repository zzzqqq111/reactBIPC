/* eslint-disable no-eval */
/* eslint-disable no-unused-expressions */
/**
 *  选择市场或者品牌
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Icon, Upload } from 'antd';
import axios from 'axios';
import { fileSign } from '@/services/api';
import { getToken } from '@/utils/authority';
// import ali-oss from 'ali-oss'

@connect()
class UploadCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      dataParam: {},
      name: '',
    };
  }

  beforeUpload = async file => {
    this.setState({
      name: file.name,
    });
    const res = await this.fetchUploadToken(file);
    return res;
  };

  // 获取上传凭证
  fetchUploadToken = async () => {
    const params = {
      quantity: 1,
      module: 3,
      fileType: 1,
    };
    const { dir } = this.props;
    const res = await fileSign(params);
    const { name } = this.state;
    const token = getToken();
    if (res.message === 'success') {
      this.setState({
        url: `https://${res.host}`,
        dataParam: {
          key: `${dir}${name}`,
          policy: res.policyBase64,
          OSSAccessKeyId: res.accessId,
          success_action_status: '200',
          callback: res.callback,
          signature: res.signature,
          token,
        },
      });
      return true;
    }
    return false;
  };

  successUpload = () => {
    const {
      actionUrl = '',
      listUrl = '',
      success = false,
      getUrl = () => {},
      dispatch,
      params = {},
    } = this.props;
    const { name, dataParam } = this.state;
    if (success) {
      getUrl(dataParam.key, name);
      message.success('上传成功');
    } else {
      dispatch({
        type: actionUrl,
        payload: { ...params, fileName: name, fileKey: dataParam.key },
      }).then(() => {
        message.success('上传成功');
        if (listUrl) {
          dispatch({
            type: listUrl,
          });
        }
      });
    }
  };

  uploadProps = () => {
    const { url, dataParam } = this.state;
    const { allowUploadAll = false } = this.props;
    const props = {
      name: 'file',
      showUploadList: false,
      accept: allowUploadAll ? '' : '.xlsx,.xls',
      action: url,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: dataParam,
      beforeUpload: this.beforeUpload,
      onSuccess: () => {
        this.successUpload();
      },
      customRequest({ action, data, file, filename, headers, onSuccess }) {
        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach(item => {
            formData.append(item, data[item]);
          });
        }
        formData.append('name', file.name);
        formData.append(filename, file);
        axios
          .post(action, formData, {
            headers,
          })
          .then(response => {
            if (response.status === 200) {
              onSuccess();
            } else {
              message.error(`上传失败${response.statusText}`);
            }
          })
          .catch(error => {
            message.error(`上传失败${error}`);
          });
      },
    };
    return props;
  };

  render() {
    const { name = '上传文件', type = 'primary', showIcon = false } = this.props;
    return (
      <Upload {...this.uploadProps()} withCredentials>
        <Button type={type}>
          {showIcon ? <Icon type="upload" /> : null}
          {name}
        </Button>
      </Upload>
    );
  }
}
export default UploadCommon;
