/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Table,
  Divider,
  Switch,
  Button,
  Modal,
  List,
  notification,
  Pagination,
  Row,
  Col,
  Form,
  Input,
  message,
} from 'antd';
import { formatTime } from '@/utils/timeFormat';
import UploadCommon from '../components/uploadPublic';

const FormItem = Form.Item;
let arr = [];
const rowSelection = {
  onChange: selectedRowKeys => {
    arr = selectedRowKeys;
  },
};
@connect(({ dataCollection, loading }) => ({
  list: dataCollection.list,
  listLoading: loading.effects['dataCollection/fetchList'],
  historyList: dataCollection.historyList,
  paramsTransaction: dataCollection.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataCollectionId: '',
    };
  }

  componentDidMount() {
    const { dispatch, paramsTransaction } = this.props;
    dispatch({
      type: 'dataCollection/fetchList',
      payload: {
        ...paramsTransaction.payload,
      },
    });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataCollection/switch',
      payload: {
        id,
        isEnable: Number(checked),
      },
      callback: () => {
        notification.success({
          message: checked ? '已启用' : '已关闭',
        });
      },
    });
  };

  showModal = dataCollectionId => {
    const { dispatch } = this.props;
    this.setState({ dataCollectionId });
    dispatch({
      type: 'dataCollection/getHistory',
      payload: {
        dataCollectionId,
      },
      callback: () => {
        this.setState({
          visible: true,
        });
      },
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
      paramsTransaction: { payload = {} },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <FormItem>
              {getFieldDecorator('name', { initialValue: payload.name })(
                <Input placeholder="采集名称" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('tableName', { initialValue: payload.tableName })(
                <Input placeholder="表名称" />
              )}
            </FormItem>
            {/* <FormItem>
              {getFieldDecorator('sqlScript')(<Input placeholder="脚本内容" style={{width:'300px'}} />)}
            </FormItem> */}
          </Col>
          <Col md={4} sm={24} style={{ paddingLeft: 0, textAlign: 'right' }}>
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
        type: 'dataCollection/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'dataCollection/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'dataCollection/fetchList',
    });
    dispatch({
      type: 'dataCollection/saveParam',
      payload: {},
    });
  };

  exportData = () => {
    // 导出数据
    if (arr.length === 0) {
      message.error('请先选择要导出的数据');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'dataCollection/exportData',
      payload: { idArray: JSON.stringify(arr) },
    });
  };

  render() {
    const { list, listLoading, dispatch, historyList, paramsTransaction } = this.props;
    const { visible, dataCollectionId } = this.state;
    return (
      <div>
        {this.renderSimpleForm()}
        <Row>
          <Col span={18}>
            <Button
              onClick={() => {
                router.push('/back/dataCollection/detail');
              }}
              type="primary"
              style={{ marginBottom: 16 }}
            >
              新增数据采集
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button onClick={this.exportData} style={{ marginRight: '20px' }}>
              导出数据采集
            </Button>
            <UploadCommon
              actionUrl="dataCollection/importData"
              listUrl="dataCollection/fetchList"
              success
              name="导入数据"
            />
          </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '采集编号', dataIndex: 'id' },
            { title: '采集名称', dataIndex: 'name' },
            {
              title: '功能描述',
              dataIndex: 'description',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {text}
                </div>
              ),
            },
            {
              title: '表名称',
              dataIndex: 'tableName',
            },
            {
              title: '采集方式',
              dataIndex: 'dataDealType',
              render: text => {
                if (text === 0) {
                  return <span>新增</span>;
                }
                if (text === 1) {
                  return <span>替换</span>;
                }
                return <span>更新</span>;
              },
            },
            { title: '预警通知邮箱', dataIndex: 'warnEmail' },
            { title: '采集状态', dataIndex: 'taskState' },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/dataCollection/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <a onClick={this.showModal.bind(this, record.id)}>采集历史</a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'dataCollection/testDataCollection',
                        payload: { id: record.id },
                      }).then(() => {
                        notification.success({
                          message: '正在采集中',
                        });
                      });
                    }}
                  >
                    试采
                  </a>
                </span>
              ),
            },
            {
              title: '是否启用',
              dataIndex: 'isEnable',
              render: (text = true, record) => (
                <Switch
                  checkedChildren="已启用"
                  unCheckedChildren="未启用"
                  defaultChecked={Boolean(text)}
                  onChange={checked => this.switch(checked, record.id)}
                />
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataCollection/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataCollection/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            current: list.current,
            total: list.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
            showTotal: () => {
              return `共 ${list.total} 条`;
            },
          }}
        />
        <Modal
          title="采集历史"
          width="80vw"
          maskClosable={false}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={
            <Pagination
              onChange={(pageNo, pageSize) => {
                dispatch({
                  type: 'dataCollection/getHistory',
                  payload: {
                    pageNo,
                    pageSize,
                    dataCollectionId,
                  },
                });
              }}
              onShowSizeChange={(pageNo, pageSize) => {
                dispatch({
                  type: 'dataCollection/getHistory',
                  payload: {
                    pageNo,
                    pageSize,
                    dataCollectionId,
                  },
                });
              }}
              current={historyList.current}
              total={historyList.total}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['10', '30', '50', '80', '100']}
            />
          }
        >
          <List
            style={{ overflow: 'scroll', maxHeight: '60vh' }}
            itemLayout="vertical"
            size="large"
            dataSource={historyList.records.map(history => ({
              ...history,
              // gmtCreated: formatTime(history.gmtCreated),
              endTime: formatTime(history.endTime),
              startTime: formatTime(history.startTime),
            }))}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={`状态:${item.status}`}
                  description={`${item.startTime}-${item.endTime}`}
                />
                {item.log}
              </List.Item>
            )}
          />
        </Modal>
      </div>
    );
  }
}

export default Index;
