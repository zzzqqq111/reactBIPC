/* eslint-disable no-eval */
/* eslint-disable no-unused-expressions */
/**
 *  处理加密的上传文件
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Icon, Upload } from 'antd';
import { fileRequest } from './request';
import FetchURL from '@/services/FetchURL';

@connect()
class UploadCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      // ossToken: '',
    };
  }

  beforeUpload = async file => {
    this.setState({
      name: file.name,
    });
  };

  successUpload = objKey => {
    const {
      success = false,
      getUrl = () => {},
      dispatch,
      actionUrl = '',
      listUrl = '',
      params,
    } = this.props;
    const { name } = this.state;
    if (success) {
      getUrl(objKey, name);
      // message.success('上传成功');
    } else {
      dispatch({
        type: actionUrl,
        payload: { fileName: name, ...objKey, ...params },
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
    // const { ossToken } = this.state;
    const { allowUploadAll = false, fileNumber = '' } = this.props;
    const props = {
      name: 'file',
      showUploadList: false,
      accept: allowUploadAll ? '' : '.xlsx,.xls',
      headers: {
        'content-type': 'multipart/form-data',
      },
      beforeUpload: this.beforeUpload,
      onSuccess: objKey => {
        this.successUpload(objKey);
      },
      customRequest({ data, file, filename, onSuccess }) {
        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach(item => {
            formData.append(item, data[item]);
          });
        }
        if (fileNumber && fileNumber !== '') {
          formData.append('type', fileNumber);
        }
        formData.append('name', file.name);
        formData.append('directory', 'roseBi/');
        formData.append(filename, file);

        fileRequest(FetchURL.uploadFileUrl, { data: formData })
          .then(response => {
            onSuccess(response.data.data);
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
