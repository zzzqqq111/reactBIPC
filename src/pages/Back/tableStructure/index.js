/* eslint-disable no-eval */
/**
 *  指标库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Table,
  Divider,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  List,
  message,
  Popconfirm,
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
@connect(({ tableStructure, loading }) => ({
  list: tableStructure.list,
  listLoading: loading.effects['tableStructure/fetchList'],
  historyList: tableStructure.historyList,
  paramsTransaction: tableStructure.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // id: '',
    };
  }

  componentDidMount() {
    const { dispatch, paramsTransaction } = this.props;
    dispatch({
      type: 'tableStructure/fetchList',
      payload: {
        ...paramsTransaction.payload,
      },
    });
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
      paramsTransaction: { payload = {} },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem>
              {getFieldDecorator('tableName', { initialValue: payload.tableName })(
                <Input placeholder="表名称" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('define', { initialValue: payload.define })(
                <Input placeholder="中文表名" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{ textAlign: 'right' }}>
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
        type: 'tableStructure/fetchList',
        payload: value,
      });
      dispatch({
        type: 'tableStructure/changeParam',
        payload: value,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'tableStructure/fetchList',
    });
    dispatch({
      type: 'tableStructure/resetParam',
    });
  };

  showModal = id => {
    const { dispatch } = this.props;
    // this.setState({ id });
    dispatch({
      type: 'tableStructure/getHistory',
      payload: { tableStructureId: id },
      callback: () => {
        this.setState({
          visible: true,
        });
      },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
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
      type: 'tableStructure/exportData',
      payload: { idArray: JSON.stringify(arr) },
    });
  };

  render() {
    const { list = {}, listLoading, dispatch, paramsTransaction, historyList } = this.props;
    const { visible } = this.state;

    return (
      <div>
        {this.renderSimpleForm()}
        <Row>
          <Col span={18}>
            <Button
              onClick={() => {
                router.push('/back/tableStructure/detail');
              }}
              type="primary"
              style={{ marginBottom: 16 }}
            >
              创建表
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: '20px' }} onClick={this.exportData}>
              导出表结构
            </Button>
            <UploadCommon
              actionUrl="tableStructure/importData"
              listUrl="tableStructure/fetchList"
              name="导入表结构"
            />
          </Col>
        </Row>
        <Table
          loading={listLoading}
          rowSelection={rowSelection}
          dataSource={
            list.records
              ? list.records.map(sourceData => ({
                  ...sourceData,
                  key: sourceData.id,
                }))
              : null
          }
          columns={[
            {
              title: '库名',
              dataIndex: 'databaseName',
            },
            {
              title: '表名称',
              dataIndex: 'tableName',
              render: text => (
                <div
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'initial',
                  }}
                >
                  {text}
                </div>
              ),
            },
            {
              title: '中文表名',
              dataIndex: 'define',
              render: text => (
                <div
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'initial',
                  }}
                >
                  {text}
                </div>
              ),
            },
            {
              title: '指标渠道',
              dataIndex: 'channelName',
            },
            {
              title: '数据颗粒',
              dataIndex: 'particlenName',
            },
            {
              title: '创建用户',
              dataIndex: 'userName',
              render: text => (
                <div
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'initial',
                  }}
                >
                  {text}
                </div>
              ),
            },
            {
              title: '创建时间',
              dataIndex: 'gmtCreated',
              render: text => <div>{text ? formatTime(text) : ''}</div>,
            },
            {
              title: '修改时间',
              dataIndex: 'gmtModify',
              render: text => <div>{text ? formatTime(text) : ''}</div>,
            },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/tableStructure/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <a onClick={this.showModal.bind(this, record.id)}>修改历史</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确认彻底删除表？"
                    onConfirm={() => {
                      dispatch({
                        type: 'tableStructure/deleteTable',
                        payload: { id: record.id },
                        callback: () => {
                          dispatch({
                            type: 'tableStructure/fetchList',
                            payload: {
                              ...paramsTransaction.payload,
                            },
                          });
                        },
                      });
                    }}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </span>
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'tableStructure/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'tableStructure/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  paramsTransaction,
                },
              });
            },
            total: list.total,
            current: list.current,
            showSizeChanger: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
            showQuickJumper: true,
            showTotal: () => {
              return `共 ${list.total} 条`;
            },
          }}
        />
        <Modal
          title="修改记录"
          width="80vw"
          maskClosable={false}
          visible={visible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >
          <List
            style={{ overflow: 'scroll', maxHeight: '60vh' }}
            itemLayout="vertical"
            size="large"
            dataSource={historyList.map(history => ({
              ...history,
              gmtCreated: formatTime(history.gmtCreated),
            }))}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta title={`${item.content}`} description={`${item.gmtCreated}`} />
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
