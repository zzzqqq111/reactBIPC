/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Radio, Row, Col, notification } from 'antd';
import router from 'umi/router';

const { Option } = Select;

@connect(({ singleDataCollection, loading, global }) => {
  return {
    instanceTypes: global.instanceTypes,
    detail: singleDataCollection.detail,
    detailLoading: loading.effects['dataCollsingleDataCollectionection/fetchDetail'],
    destDbList: singleDataCollection.destDbList,
    fromDbList: singleDataCollection.fromDbList,
    dbInstanceList: singleDataCollection.dbInstanceList,
  };
})
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
      form,
    } = this.props;
    dispatch({
      type: 'singleDataCollection/destDbQuery',
    });
    dispatch({
      type: 'singleDataCollection/fromDbQuery',
    });
    dispatch({
      type: 'singleDataCollection/dbInstanceQuery',
    });
    if (query.id) {
      dispatch({
        type: 'singleDataCollection/fetchDetail',
        payload: query,
        callback: res => {
          form.setFieldsValue({
            fromDbId: res.fromDbId,
            destDbId: res.destDbId,
          });
        },
      });
    } else {
      dispatch({
        type: 'singleDataCollection/resetDetail',
        payload: query,
      });
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(
      (
        err,
        {
          id,
          name,
          fromDbId,
          destDbId,
          fromTable,
          destTable,
          fromColumns,
          destColumns,
          cronExpression,
          breakColumn,
          breakValue,
          collectType,
          breakInit,
          conditions,
        }
      ) => {
        if (!err) {
          dispatch({
            type: 'singleDataCollection/update',
            payload: Object.assign(
              {},
              {
                name,
                fromDbId,
                destDbId,
                fromTable,
                destTable,
                fromColumns,
                destColumns,
                cronExpression,
                breakColumn,
                breakValue,
                collectType,
                breakInit,
                conditions: btoa(encodeURIComponent(conditions)),
              },
              id
                ? {
                    id,
                  }
                : {}
            ),
            callback: () => {
              notification.success({
                message: '保存成功',
              });
              router.push('/back/singleDataCollection');
            },
          });
        }
      }
    );
  };

  // 数据处理时选项改变
  dataChange = e => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'singleDataCollection/changeDataType',
      payload: value,
    });
  };

  // 根据环境获取不同的库
  fromChange = id => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'singleDataCollection/fromDbQuery',
      payload: { dbInstanceId: id },
      callback: () => {
        form.setFieldsValue({
          fromDbId: [],
        });
      },
    });
  };

  // 根据环境获取不同的库
  destChange = id => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'singleDataCollection/destDbQuery',
      payload: { dbInstanceId: id },
      callback: () => {
        form.setFieldsValue({
          destDbId: [],
        });
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      detail,
      destDbList = [],
      fromDbList = [],
      dbInstanceList = [],
      location: { query },
    } = this.props;
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
    return (
      <div>
        <Row>
          <Col span={2} offset={22} style={{ textAlign: 'right' }}>
            <Button
              icon="close"
              onClick={() => {
                router.goBack();
              }}
            >
              关闭
            </Button>
          </Col>
        </Row>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12}>
              <Form.Item label="采集编号">
                {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="采集名称">
                {getFieldDecorator('name', {
                  initialValue: detail.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入采集名称!',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="源环境">
                {getFieldDecorator('fromEnv', { initialValue: detail.fromDbInstanceId })(
                  <Select placeholder="请选择环境" disabled={!!query.id} onChange={this.fromChange}>
                    {dbInstanceList.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="目标环境">
                {getFieldDecorator('destEnv', { initialValue: detail.destDbInstanceId })(
                  <Select placeholder="请选择环境" disabled={!!query.id} onChange={this.destChange}>
                    {dbInstanceList.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="源库名">
                {getFieldDecorator('fromDbId', {
                  // initialValue: detail.fromDbId,
                  rules: [
                    {
                      required: true,
                      message: '请选择源库名!',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择源库名"
                    showSearch
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
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="目标库名">
                {getFieldDecorator('destDbId', {
                  // initialValue: detail.destDbId,
                  rules: [
                    {
                      required: true,
                      message: '请选择目标库名!',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择目标库名"
                    showSearch
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
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="源表">
                {getFieldDecorator('fromTable', {
                  initialValue: detail.fromTable,
                  rules: [
                    {
                      required: true,
                      message: '请输入源表!',
                    },
                  ],
                })(<Input placeholder="请输入源表" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="目标表">
                {getFieldDecorator('destTable', {
                  initialValue: detail.destTable,
                  rules: [
                    {
                      required: true,
                      message: '请输入目标表!',
                    },
                  ],
                })(<Input placeholder="请输入目标表" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="源字段">
                {getFieldDecorator('fromColumns', {
                  initialValue: detail.fromColumns,
                  rules: [
                    {
                      required: true,
                      message: '请输入源字段!',
                    },
                  ],
                })(<Input placeholder="请输入源字段" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="目标字段">
                {getFieldDecorator('destColumns', {
                  initialValue: detail.destColumns,
                  rules: [
                    {
                      required: true,
                      message: '请输入目标字段!',
                    },
                  ],
                })(<Input placeholder="请输入目标字段" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="调度规则">
                {getFieldDecorator('cronExpression', {
                  initialValue: detail.cronExpression,
                  rules: [
                    {
                      required: true,
                      message: '请输入调度规则!',
                    },
                  ],
                })(<Input placeholder="请输入调度规则" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="采集方式">
                {getFieldDecorator('collectType', {
                  initialValue: detail.collectType,
                  rules: [
                    {
                      required: true,
                      message: '请选择采集方式!',
                    },
                  ],
                })(
                  <Radio.Group onChange={this.dataChange}>
                    <Radio value={0}>全量</Radio>
                    <Radio value={1}>增量</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="断点字段">
                {getFieldDecorator('breakColumn', {
                  initialValue: detail.breakColumn,
                })(<Input placeholder="请输入字段" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="断点值">
                {getFieldDecorator('breakValue', {
                  initialValue: detail.breakValue,
                })(<Input placeholder="请输入值" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="重采初始值">
                {getFieldDecorator('breakInit', {
                  initialValue: detail.breakInit,
                })(<Input placeholder="请输入重采初始值" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="采集条件">
                {getFieldDecorator('conditions', {
                  initialValue: detail.conditions,
                })(<Input.TextArea placeholder="请输入采集条件" rows={5} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Detail;
