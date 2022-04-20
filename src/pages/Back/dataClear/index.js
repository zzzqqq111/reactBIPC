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
  // Select,
} from 'antd';
import { formatTime } from '@/utils/timeFormat';
import UploadCommon from '../components/uploadPublic';

// const { Option } = Select;
const FormItem = Form.Item;
let arr = [];
const rowSelection = {
  onChange: selectedRowKeys => {
    arr = selectedRowKeys;
  },
};
@connect(({ dataClear, loading }) => ({
  list: dataClear.list,
  listLoading: loading.effects['dataClear/fetchList'],
  historyList: dataClear.historyList,
  paramsTransaction: dataClear.paramsTransaction,
  // destDbList: dataClear.destDbList,
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
      type: 'dataClear/fetchList',
      payload: {
        ...paramsTransaction.payload,
      },
    });
    // dispatch({
    //   type: 'dataClear/destDbQuery',
    // });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataClear/switch',
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
      type: 'dataClear/getHistory',
      payload: {
        dataRinseId: dataCollectionId,
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
                <Input placeholder="清洗名称" />
              )}
            </FormItem>
            {/* <FormItem>
              {getFieldDecorator('destDb')(
                <Select
                  placeholder="库名"
                  style={{ width: '150px' }}
                  showSearch
                  filterOption={(inputValue, item) =>
                    item.props.children.indexOf(inputValue) !== -1
                  }
                  allowClear
                >
                  {destDbList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.alias}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem> */}
            <FormItem>
              {getFieldDecorator('destTable', { initialValue: payload.destTable })(
                <Input placeholder="表名" />
              )}
            </FormItem>
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
      const serarArr = Object.keys(fieldsValue);
      const value = {};
      serarArr.forEach(item => {
        if (fieldsValue[item] && fieldsValue[item] !== 'undefined') {
          value[item] = fieldsValue[item];
        }
      });
      dispatch({
        type: 'dataClear/fetchList',
        payload: value,
      });
      dispatch({
        type: 'dataClear/saveParam',
        payload: value,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'dataClear/fetchList',
    });
    dispatch({
      type: 'dataClear/saveParam',
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
      type: 'dataClear/exportData',
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
                router.push('/back/dataClear/detail');
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
              actionUrl="dataClear/importData"
              listUrl="dataClear/fetchList"
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
            { title: '清洗名称', dataIndex: 'name' },
            // {
            //   title: '目标库',
            //   dataIndex: 'destDb',
            // },
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
                      router.push(`/back/dataClear/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <a onClick={this.showModal.bind(this, record.id)}>清洗历史</a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'dataClear/DataRinseReTest',
                        payload: { id: record.id },
                      }).then(() => {
                        notification.success({
                          message: '正在采集中',
                        });
                      });
                    }}
                  >
                    试运行
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'dataClear/DataRinseReReTry',
                        payload: { id: record.id },
                      }).then(() => {
                        notification.success({
                          message: '正在采集中',
                        });
                      });
                    }}
                  >
                    重运行
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
                type: 'dataClear/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataClear/fetchList',
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
                  type: 'dataClear/getHistory',
                  payload: {
                    pageNo,
                    pageSize,
                    dataCollectionId,
                  },
                });
              }}
              onShowSizeChange={(pageNo, pageSize) => {
                dispatch({
                  type: 'dataClear/getHistory',
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
