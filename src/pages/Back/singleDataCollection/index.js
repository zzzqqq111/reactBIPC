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
  Select,
} from 'antd';
import UploadCommon from '../components/uploadPublic';
import { formatTime } from '@/utils/timeFormat';

const FormItem = Form.Item;
const { Option } = Select;
let arr = [];
const rowSelection = {
  onChange: selectedRowKeys => {
    arr = selectedRowKeys;
  },
};
@connect(({ singleDataCollection, loading }) => ({
  list: singleDataCollection.list,
  listLoading: loading.effects['singleDataCollection/fetchList'],
  historyList: singleDataCollection.historyList,
  paramsTransaction: singleDataCollection.paramsTransaction,
  destDbList: singleDataCollection.destDbList,
  fromDbList: singleDataCollection.fromDbList,
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
      type: 'singleDataCollection/fetchList',
      payload: {
        ...paramsTransaction.payload,
      },
    });
    dispatch({
      type: 'singleDataCollection/destDbQuery',
    });
    dispatch({
      type: 'singleDataCollection/fromDbQuery',
    });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'singleDataCollection/switch',
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

  openSync = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'singleDataCollection/openSysnc',
      payload: {
        id,
        openSync: Number(checked),
      },
      callback: () => {
        notification.success({
          message: checked ? '开启' : '关闭',
        });
      },
    });
  };

  showModal = dataCollectionId => {
    const { dispatch } = this.props;
    this.setState({ dataCollectionId });
    dispatch({
      type: 'singleDataCollection/getHistory',
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
      destDbList = [],
      fromDbList = [],
      paramsTransaction: { payload = {} },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem>
              {getFieldDecorator('name', { initialValue: payload.name })(
                <Input placeholder="采集名称" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('fromDbId', { initialValue: payload.fromDbId })(
                <Select
                  style={{ width: '150px' }}
                  placeholder="请选择源库名"
                  showSearch
                  allowClear
                  filterOption={(inputValue, item) =>
                    item.props.children.indexOf(inputValue) !== -1
                  }
                >
                  {fromDbList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.alias}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('destDbId', { initialValue: payload.destDbId })(
                <Select
                  style={{ width: '150px' }}
                  placeholder="请选择目标库名"
                  showSearch
                  allowClear
                  filterOption={(inputValue, item) =>
                    item.props.children.indexOf(inputValue) !== -1
                  }
                >
                  {destDbList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.alias}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('fromTable', { initialValue: payload.fromTable })(
                <Input placeholder="源表" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('destTable', { initialValue: payload.destTable })(
                <Input placeholder="目标表" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{ paddingLeft: 0, textAlign: 'right' }}>
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
      const serarArr = Object.keys(fieldsValue);
      const value = {};
      serarArr.forEach(item => {
        if (fieldsValue[item] && fieldsValue[item] !== 'undefined') {
          value[item] = fieldsValue[item];
        }
      });
      dispatch({
        type: 'singleDataCollection/fetchList',
        payload: value,
      });
      dispatch({
        type: 'singleDataCollection/saveParam',
        payload: value,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'singleDataCollection/fetchList',
    });
    dispatch({
      type: 'singleDataCollection/saveParam',
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
      type: 'singleDataCollection/exportData',
      payload: { idArray: JSON.stringify(arr) },
    });
  };

  render() {
    const { list, listLoading, dispatch, paramsTransaction, historyList = [] } = this.props;
    const { visible, dataCollectionId } = this.state;
    return (
      <div>
        {this.renderSimpleForm()}
        <Row>
          <Col span={18}>
            <Button
              onClick={() => {
                router.push('/back/singleDataCollection/detail');
              }}
              type="primary"
              style={{ marginBottom: 16 }}
            >
              新增表采集
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button onClick={this.exportData} style={{ marginRight: '20px' }}>
              导出数据采集
            </Button>
            <UploadCommon
              actionUrl="singleDataCollection/importData"
              listUrl="singleDataCollection/fetchList"
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
            { title: '编号', dataIndex: 'id' },
            { title: '采集名称', dataIndex: 'name' },
            {
              title: '源库',
              dataIndex: 'fromDbName',
            },
            {
              title: '源表',
              dataIndex: 'fromTable',
            },
            {
              title: '目标库',
              dataIndex: 'destDbName',
            },
            {
              title: '目标表',
              dataIndex: 'destTable',
            },
            {
              title: '创建用户',
              dataIndex: 'createUser',
            },
            { title: '任务状态', dataIndex: 'status' },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/singleDataCollection/detail?id=${record.id}`);
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
                        type: 'singleDataCollection/testDataCollection',
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
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'singleDataCollection/reDataCollection',
                        payload: { id: record.id },
                      }).then(() => {
                        notification.success({
                          message: '正在采集中',
                        });
                      });
                    }}
                  >
                    重采
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
            {
              title: '是否开启同步',
              dataIndex: 'openSync',
              render: (text = true, record) => (
                <Switch
                  checkedChildren="已开启"
                  unCheckedChildren="未开启"
                  defaultChecked={Boolean(text)}
                  onChange={checked => this.openSync(checked, record.id)}
                />
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'singleDataCollection/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'singleDataCollection/fetchList',
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
                  type: 'singleDataCollection/getHistory',
                  payload: {
                    pageNo,
                    pageSize,
                    dataCollectionId,
                  },
                });
              }}
              onShowSizeChange={(pageNo, pageSize) => {
                dispatch({
                  type: 'singleDataCollection/getHistory',
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
