/* eslint-disable no-eval */
/* eslint-disable no-unused-expressions */
/**
 *  后台表结构导入和
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Icon, Upload } from 'antd';
import axios from 'axios';
import { fileSignPublic } from '@/services/api';

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
    const res = await this.fetchUploadToken();
    return res;
  };

  // 获取上传凭证
  fetchUploadToken = async () => {
    const params = {
      quantity: 1,
      module: 3,
      fileType: 1,
    };
    const res = await fileSignPublic(params);
    if (res.message === 'success') {
      this.setState({
        url: res.host,
        dataParam: {
          key: `res/reactBiPc/${res.filename}`,
          policy: res.policyBase64,
          OSSAccessKeyId: res.accessId,
          success_action_status: '200',
          callback: res.callback,
          signature: res.signature,
        },
      });
      return true;
    }
    return false;
  };

  successUpload = url => {
    const {
      actionUrl = '',
      listUrl = '',
      success = false,
      getUrl = () => {},
      dispatch,
      params = {},
    } = this.props;
    const { name } = this.state;
    if (!url) {
      return;
    }
    if (success) {
      getUrl(url);
      message.success('上传成功');
    } else {
      dispatch({
        type: actionUrl,
        payload: { url, ...params, fileName: name },
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
    const props = {
      name: 'file',
      showUploadList: false,
      accept: '.xlsx,.xls',
      action: url,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: dataParam,
      beforeUpload: this.beforeUpload,
      onSuccess: downloadUrl => {
        this.successUpload(downloadUrl);
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
            const info = response.request.response;
            const obj = eval(`(${info})`);
            const fileInfo = eval(`(${obj.responseBody})`);
            onSuccess(fileInfo.filename);
          })
          .catch(error => {
            message.error(`上传失败${error.code}`);
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
