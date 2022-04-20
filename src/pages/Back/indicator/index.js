/**
 *  指标库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Table,
  Divider,
  Switch,
  Button,
  notification,
  Row,
  Col,
  Select,
  Form,
  Input,
  Cascader,
} from 'antd';
import UploadCommon from '../components/uploadPublic';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ indicator, loading }) => ({
  list: indicator.list,
  listLoading: loading.effects['indicator/fetchList'],
  indicatorTypeList: indicator.indicatorTypeList,
  paramsTransaction: indicator.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'indicator/fetchList',
    });
    dispatch({
      type: 'indicator/fetchIndicatorTypeList',
    });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indicator/switch',
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

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
      indicatorTypeList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="指标名称" />)}</FormItem>
            <FormItem>{getFieldDecorator('define')(<Input placeholder="指标定义" />)}</FormItem>
            <FormItem>
              {getFieldDecorator('type')(
                <Cascader
                  placeholder="指标渠道/颗粒/维度/业务"
                  options={indicatorTypeList}
                  changeOnSelect
                />
              )}
            </FormItem>
            <FormItem>{getFieldDecorator('tableName')(<Input placeholder="表名称" />)}</FormItem>
            <FormItem>{getFieldDecorator('tableField')(<Input placeholder="表字段" />)}</FormItem>
            <FormItem>
              {getFieldDecorator('isEnable')(
                <Select placeholder="是否启用" style={{ width: '100px' }}>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
      let value = fieldsValue;
      if (fieldsValue.type) {
        value = {
          ...fieldsValue,
          channel: fieldsValue.type[0],
          dataParticles: fieldsValue.type[1],
          dataDimension: fieldsValue.type[2],
          indicatorsTypeId: fieldsValue.type[3],
          type: '',
        };
      }
      dispatch({
        type: 'indicator/fetchList',
        payload: value,
      });
      dispatch({
        type: 'indicator/changeParam',
        payload: value,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'indicator/fetchList',
    });
    dispatch({
      type: 'indicator/resetParam',
    });
  };

  render() {
    const { list = {}, listLoading, dispatch, paramsTransaction } = this.props;

    return (
      <div>
        {this.renderSimpleForm()}
        <Row>
          <Col span={2}>
            <Button
              onClick={() => {
                router.push('/back/indicator/detail');
              }}
              type="primary"
              style={{ marginBottom: 16 }}
            >
              新增指标
            </Button>
          </Col>
          <Col span={1}>
            <UploadCommon
              actionUrl="indicator/upload"
              listUrl="indicator/fetchList"
              name="导入指标"
            />
          </Col>
        </Row>
        <Table
          loading={listLoading}
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
              title: '指标编号',
              dataIndex: 'id',
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
              title: '指标名称',
              dataIndex: 'name',
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
              title: '指标定义',
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
            { title: '指标渠道', dataIndex: 'channel' },
            { title: '数据颗粒', dataIndex: 'dataParticles' },
            { title: '数据维度', dataIndex: 'dataDimension' },
            { title: '业务类型', dataIndex: 'type' },
            {
              title: '表名称',
              dataIndex: 'tableName',
              render: text => (
                <a
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'initial',
                  }}
                  onClick={() => {
                    router.push(`/back/scriptLibrary?tableName=${text}`);
                  }}
                >
                  {text}
                </a>
              ),
            },
            { title: '表字段', dataIndex: 'tableField' },
            { title: '选择器', dataIndex: 'selector' },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/indicator/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <a>通知</a>
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
                type: 'indicator/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'indicator/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
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
      </div>
    );
  }
}

export default Index;
