/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Radio,
  Select,
  message,
  Modal,
  Icon,
  Tooltip,
  Typography,
} from 'antd';
import { formatTime } from '@/utils/timeFormat';
import UploadCommon from '@/pages/Back/components/uploadFile';
import { getUserId } from '@/utils/authority';
import { fileDownloadRequest } from '../../Back/components/request';
import FetchURL from '@/services/FetchURL';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;
const { Paragraph } = Typography;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
@connect(({ dataDemand, loading }) => ({
  list: dataDemand.list,
  listLoading: loading.effects['dataDemand/fetchList'],
  paramsTransaction: dataDemand.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confimDes: { id: '', show: false },
      // auditDes: { id: '', show: false },
      nowType: '',
      id: '',
      remark: '',
      taskType: '',
      resultName: '',
      processName: '',
      userId: 0,
      // jobType: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDemand/fetchList',
    });
    const userId = getUserId();
    this.setState({
      userId: Number(userId),
    });
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem>{getFieldDecorator('jobNo')(<Input placeholder="编号" />)}</FormItem>
          </Col>
          <Col md={8} sm={24} style={{ paddingLeft: 0, textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'dataDemand/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'dataDemand/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'dataDemand/fetchList',
    });
    dispatch({
      type: 'dataDemand/saveParam',
      payload: {},
    });
  };

  filterChange = e => {
    const { dispatch, paramsTransaction = {} } = this.props;
    const { value } = e.target;
    dispatch({
      type: 'dataDemand/fetchList',
      payload: {
        ...paramsTransaction.payload,
        status: value,
      },
    });
    this.setState({
      taskType: value,
    });
  };

  // 改变优先级
  changeProiroty = (id, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDemand/updatePrority',
      payload: { id, priority: value },
    }).then(() => {
      message.success('修改成功');
    });
  };

  // 确认备注
  confimDesContent = (id, e) => {
    const { dispatch } = this.props;
    const { value } = e.target;
    dispatch({
      type: 'dataDemand/dataJobConfimDes',
      payload: { id, confimRemark: value },
      // calllback: () => {
      //   this.setState({
      //     confimDes: { id: '', show: false },
      //   });
      // },
    });
  };

  // 点击事件
  onTypeClick = (record, actionUrl, status, text) => {
    const { dispatch } = this.props;
    const { taskType, userId } = this.state;
    this.setState({
      nowType: status,
      id: record.id,
      // jobType: record.jobType,
    });
    if ((status === '确认' || status === '上传') && record.operateUserId !== userId) {
      confirm({
        title: '是否更换执行人',
        okText: '是',
        cancelText: '否',
        onOk() {
          dispatch({
            type: 'dataDemand/dataJobOperation',
            payload: { id: record.id },
          }).then(() => {
            dispatch({
              type: 'dataDemand/fetchList',
              payload: { status: taskType },
            });
          });
        },
      });
    } else if ((status === '确认' || status === '上传') && record.operateUserId === userId) {
      this.setState({
        visible: true,
      });
    } else {
      this.commonData(record, actionUrl, status, text);
    }
  };

  commonData = (record, actionUrl, status, text) => {
    const { dispatch } = this.props;
    const { taskType } = this.state;
    dispatch({
      type: actionUrl,
      payload: { id: record.id },
    }).then(() => {
      message.success(text);
      this.setState({
        nowType: status,
        id: record.id,
      });
      dispatch({
        type: 'dataDemand/fetchList',
        payload: { status: taskType },
      });
    });
  };

  // 点击上传
  uploadModal = () => {
    const { nowType } = this.state;
    if (nowType === '确认') {
      return this.renderConfimData();
    }
    if (nowType === '上传') {
      return this.renderUploadData();
    }
    if (nowType === '审核') {
      return this.renderDownloadResultData();
    }
    return null;
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  getProcess = (obj, fileName) => {
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'dataDemand/dataJobUploadData',
      payload: {
        dataJobId: id,
        sKey: obj.sKey,
        fileKey: obj.fileKey,
        fileName,
        type: 1,
      },
    })
      .then(() => {
        message.success('上传成功');
        this.setState({
          processName: fileName,
        });
      })
      .catch(error => {
        message.error(error);
      });
  };

  getResultData = (obj, fileName) => {
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'dataDemand/dataJobUploadData',
      payload: {
        dataJobId: id,
        sKey: obj.sKey,
        fileKey: obj.fileKey,
        fileName,
        type: 2,
      },
    })
      .then(() => {
        this.setState({
          resultName: fileName,
        });
      })
      .catch(error => {
        message.error(error);
      });
  };

  getRemark = e => {
    const { value } = e.target;
    this.setState({
      remark: value,
    });
  };

  // problem
  problem = () => {
    const { remark, id, taskType } = this.state;
    const { dispatch } = this.props;
    if (remark === '') {
      return message.error('请填写存在的问题');
    }
    return dispatch({
      type: 'dataDemand/dataJobProblems',
      payload: { id, auditRemark: remark },
    }).then(() => {
      dispatch({
        type: 'dataDemand/fetchList',
        payload: { status: taskType },
      });
      this.setState({
        visible: false,
      });
    });
  };

  // review审核人
  review = id => {
    const { dispatch } = this.props;
    const { taskType } = this.state;
    dispatch({
      type: 'dataDemand/dataJobReview',
      payload: { id },
    }).then(() => {
      dispatch({
        type: 'dataDemand/fetchList',
        payload: { status: taskType },
      }).then(() => {
        this.setState({
          visible: true,
          nowType: '审核',
          id,
        });
      });
    });
  };

  renderUploadData = () => {
    const { dispatch } = this.props;
    const { processName = '', resultName = '', taskType } = this.state;
    const TabConent3 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields(err => {
          if (err) return;
          this.setState({
            visible: false,
          });
          dispatch({
            type: 'dataDemand/fetchList',
            payload: { status: taskType },
          });
        });
      };
      return (
        <Form {...formItemLayout1}>
          <Form.Item label="sql脚本">
            {getFieldDecorator('fileUrl')(
              <div>
                <UploadCommon
                  type="default"
                  showIcon
                  success
                  getUrl={this.getProcess}
                  dir="record/"
                  fileNumber="1"
                />
                <span style={{ marginLeft: '15px', color: '#999' }}>上传允许格式：.xlsx,.xls</span>
                {processName ? <span style={{ display: 'block' }}>{processName}</span> : null}
              </div>
            )}
          </Form.Item>
          <Form.Item label="数据报表">
            {getFieldDecorator('resultsFileUrl')(
              <div>
                <UploadCommon
                  type="default"
                  showIcon
                  success
                  getUrl={this.getResultData}
                  dir="record/"
                  fileNumber="2"
                />
                <span style={{ marginLeft: '15px', color: '#999' }}>上传允许格式：.xlsx,.xls</span>
                {resultName ? <span style={{ display: 'block' }}>{resultName}</span> : null}
              </div>
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={submitBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    });
    return <TabConent3 />;
  };

  renderDownloadResultData = () => {
    const { id, taskType } = this.state;
    const { dispatch } = this.props;
    return (
      <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <Row className="m-top-16">
          <Col span={6} style={{ textAlign: 'right' }}>
            sql脚本
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                dispatch({
                  type: 'dataDemand/downloadResult',
                  payload: { id, type: 1 },
                  callback: data => {
                    fileDownloadRequest(FetchURL.downloadFileUrl, data).then(res => {
                      const blob = new Blob([res.data], {
                        type:
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
                      }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                      const downloadElement = document.createElement('a');
                      const href = window.URL.createObjectURL(blob); // 创建下载的链接
                      downloadElement.href = href;
                      downloadElement.download = data.fileName; // 下载后文件名
                      document.body.appendChild(downloadElement);
                      downloadElement.click(); // 点击下载
                      document.body.removeChild(downloadElement); // 下载完成移除元素
                      window.URL.revokeObjectURL(href);
                    });
                  },
                });
              }}
            >
              <Icon type="download" />
              下载文件
            </Button>
          </Col>
        </Row>
        <Row className="m-top-16">
          <Col span={6} style={{ textAlign: 'right' }}>
            数据报表
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                dispatch({
                  type: 'dataDemand/downloadResult',
                  payload: { id, type: 2 },
                  callback: data => {
                    fileDownloadRequest(FetchURL.downloadFileUrl, data).then(res => {
                      const blob = new Blob([res.data], {
                        type:
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
                      }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                      const downloadElement = document.createElement('a');
                      const href = window.URL.createObjectURL(blob); // 创建下载的链接
                      downloadElement.href = href;
                      downloadElement.download = data.fileName; // 下载后文件名
                      document.body.appendChild(downloadElement);
                      downloadElement.click(); // 点击下载
                      document.body.removeChild(downloadElement); // 下载完成移除元素
                      window.URL.revokeObjectURL(href);
                    });
                  },
                });
              }}
            >
              <Icon type="download" />
              下载文件
            </Button>
          </Col>
        </Row>
        <Row className="m-top-16">
          <Col span={6} style={{ textAlign: 'right' }}>
            审核备注
          </Col>
          <Col span={10} style={{ marginLeft: '20%' }}>
            <Input.TextArea placeholder="请填写备注" autosize onBlur={this.getRemark} />
          </Col>
        </Row>
        <Row className="m-top-16">
          <Col span={15} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              onClick={() => {
                dispatch({
                  type: 'dataDemand/dataJobAccurateDes',
                  payload: { id },
                }).then(() => {
                  dispatch({
                    type: 'dataDemand/fetchList',
                    payload: { status: taskType },
                  });
                  this.setState({
                    visible: false,
                  });
                });
              }}
              style={{ marginRight: '20px' }}
            >
              准确无误
            </Button>
            <Button type="default" onClick={this.problem}>
              存在问题
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  renderConfimData = () => {
    const { dispatch } = this.props;
    const { id, taskType } = this.state;
    const TabConent3 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          dispatch({
            type: 'dataDemand/dataJobConfimDes',
            payload: {
              id,
              ...fieldsValue,
            },
          }).then(() => {
            message.success('保存成功');
            this.setState({
              visible: false,
            });
            dispatch({
              type: 'dataDemand/fetchList',
              payload: { status: taskType },
            });
          });
        });
      };
      return (
        <Form style={{ margin: 0, paddingTop: '50px', paddingRight: '40px' }} {...formItemLayout}>
          <Form.Item label="备注">
            {getFieldDecorator('confirmRemark')(
              <Input.TextArea minRows={10} maxRows={10} placeholder="请填写备注(可不填)" />
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={submitBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    });
    return <TabConent3 />;
  };

  render() {
    const { list, listLoading, dispatch, paramsTransaction = {} } = this.props;
    const { visible, taskType, userId } = this.state;
    return (
      <div style={{ backgroundColor: '#fff', padding: '20px 24px 0' }}>
        {this.renderSimpleForm()}
        <Button
          type="primary"
          style={{ marginBottom: '16px' }}
          onClick={() => {
            router.push('/front/dataDemand/detail');
          }}
        >
          新增任务
        </Button>
        <div style={{ marginBottom: '16px' }}>
          <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.filterChange}>
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="1">待认领</Radio.Button>
            <Radio.Button value="2">待确认</Radio.Button>
            <Radio.Button value="3">待处理</Radio.Button>
            <Radio.Button value="4">待审核</Radio.Button>
            <Radio.Button value="5">已完成</Radio.Button>
            <Radio.Button value="6">已关闭</Radio.Button>
          </Radio.Group>
        </div>
        <Table
          bordered
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            {
              title: '任务进度',
              dataIndex: 'status',
              fixed: 'left',
              render: text => {
                let opetion = '';
                if (text === 1) {
                  opetion = '待认领';
                } else if (text === 2) {
                  opetion = '待确认';
                } else if (text === 3) {
                  opetion = '待处理';
                } else if (text === 4) {
                  opetion = '待审核';
                } else if (text === 5) {
                  opetion = '已完成';
                } else if (text === 6) {
                  opetion = '已关闭';
                }
                return <div>{opetion}</div>;
              },
            },
            {
              title: '可用行为',
              colSpan: 2,
              fixed: 'left',
              render: (_, record) => {
                let opetion = '-';
                let onClick = () => {};
                if (record.status === 1) {
                  opetion = '认领';
                  onClick = () => {
                    this.onTypeClick(record, 'dataDemand/dataJobOperation', '认领', '认领成功');
                  };
                } else if (record.status === 2) {
                  opetion = '确认';
                  onClick = () => {
                    this.onTypeClick(record, 'dataDemand/dataJobConfimDes', '确认', '已确认');
                  };
                } else if (record.status === 3) {
                  opetion = '上传';
                  onClick = () => {
                    this.onTypeClick(record, '', '上传', '');
                  };
                } else if (record.status === 4) {
                  opetion = '审核';
                  onClick = () => {
                    const $this = this;
                    if (record.reviewUserName && Number(record.reviewUserId) !== Number(userId)) {
                      confirm({
                        title: '是否更换审核人',
                        okText: '是',
                        cancelText: '否',
                        onOk() {
                          $this.review(record.id);
                        },
                      });
                    } else if (
                      record.reviewUserName &&
                      Number(record.reviewUserId) === Number(userId)
                    ) {
                      this.setState({
                        visible: true,
                        nowType: '审核',
                        id: record.id,
                      });
                    } else {
                      this.review(record.id);
                    }
                  };
                } else if (record.status === 5) {
                  opetion = '创建子任务';
                  onClick = () => {
                    router.push(`/front/dataDemand/detail?parentId=${record.id}`);
                  };
                }
                return <a onClick={onClick}>{opetion}</a>;
              },
            },
            {
              title: '可用行为',
              fixed: 'left',
              colSpan: 0,
              render: (_, record) => {
                if (record.status === 1 || record.status === 2) {
                  return (
                    <a
                      onClick={() => {
                        router.push(`/front/dataDemand/detail?id=${record.id}`);
                      }}
                    >
                      编辑
                    </a>
                  );
                }
                return '-';
              },
            },
            {
              title: '任务编号',
              dataIndex: 'jobNo',
              fixed: 'left',
            },
            {
              title: '创建时间',
              dataIndex: 'gmtCreated',
              render: text => <div>{formatTime(text)}</div>,
            },
            {
              title: '需求人',
              dataIndex: 'applyUserName',
            },
            {
              title: '使用人',
              dataIndex: 'userName',
              render: text => {
                const users = text.map((item, index) => (
                  <span
                    style={{
                      display: 'inline-block',
                      marginRight: '7px',
                    }}
                  >
                    {item}
                    {index !== text.length - 1 ? <span>,</span> : null}
                  </span>
                ));
                return (
                  <div
                    style={{
                      width: '200px',
                      wordWrap: 'break-word',
                      wordBreak: 'break-all',
                      whiteSpace: 'initial',
                    }}
                  >
                    {users}
                  </div>
                );
              },
            },
            {
              title: '任务类型',
              dataIndex: 'jobType',
              render: text => {
                let type = '';
                if (text === 1) {
                  type = '临时取数';
                } else if (text === 2) {
                  type = '开通权限';
                } else if (text === 3) {
                  type = '短信营销';
                }
                return <div>{type}</div>;
              },
            },
            {
              title: '详情描述',
              dataIndex: 'description',
              render: text => (
                <Tooltip placement="bottom" title={text}>
                  <div style={{ width: '200px' }}>
                    <Paragraph
                      style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {text}
                    </Paragraph>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '执行人',
              dataIndex: 'operateUserName',
            },
            {
              title: '复核人',
              dataIndex: 'reviewUserName',
            },
            {
              title: '确认备注',
              dataIndex: 'confirmRemark',
              render: text => (
                <Tooltip placement="bottom" title={text}>
                  <div
                    style={{
                      width: '200px',
                    }}
                  >
                    <Paragraph
                      style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {text}
                    </Paragraph>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '审核备注',
              dataIndex: 'auditRemark',
              render: text => (
                <Tooltip placement="bottom" title={text}>
                  <div
                    style={{
                      width: '200px',
                    }}
                  >
                    <Paragraph
                      style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {text}
                    </Paragraph>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '优先级',
              dataIndex: 'priority',
              render: (text, record) => (
                <Select
                  defaultValue={text || 3}
                  onChange={this.changeProiroty.bind(this, record.id)}
                  style={{ width: '100px' }}
                  disabled={record.status === 6}
                >
                  <Option key="1" value={1}>
                    非常紧急
                  </Option>
                  <Option key="2" value={2}>
                    紧急
                  </Option>
                  <Option key="3" value={3}>
                    一般
                  </Option>
                </Select>
              ),
            },
            {
              title: '操作',
              render: (_, record) => (
                <a
                  onClick={() => {
                    dispatch({
                      type: 'dataDemand/delete',
                      payload: { id: record.id },
                    }).then(() => {
                      dispatch({
                        type: 'dataDemand/fetchList',
                        payload: { status: taskType },
                      });
                    });
                  }}
                  disabled={record.status === 6}
                >
                  关闭
                </a>
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataDemand/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                  status: taskType,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataDemand/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                  status: taskType,
                },
              });
            },
            current: list.current,
            total: list.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
          }}
        />
        <Modal
          visible={visible}
          onCancel={this.onClose}
          footer={false}
          style={{ width: '200px', height: '300px !important' }}
        >
          {this.uploadModal()}
        </Modal>
      </div>
    );
  }
}

export default Index;
