/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Radio, Row, Col, notification, Divider } from 'antd';
import router from 'umi/router';

const { Option } = Select;

@connect(({ dataCollection, dbInstance, loading, global }) => {
  return {
    instanceTypes: global.instanceTypes,
    detail: dataCollection.detail,
    detailLoading: loading.effects['dataCollection/fetchDetail'],
    dbInstanceList: dbInstance.list.map(({ id, name }) => ({
      id,
      name,
    })),
    misfireList: dataCollection.misfireList,
  };
})
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;

    dispatch({
      type: 'dbInstance/fetchList',
    });

    if (query.id) {
      dispatch({
        type: 'dataCollection/fetchDetail',
        payload: query,
      });
    } else {
      dispatch({
        type: 'dataCollection/resetDetail',
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
          dbInstanceId,
          description,
          sqlScript,
          tableName,
          cronExpression,
          misfireStrategy,
          args,
          priorityIds,
          dataDealType,
          warnEmail,
          resultColumns,
          lastRecordFrom,
          lastRecordValue,
          updateColumns,
          updateConditions,
        }
      ) => {
        if (!err) {
          dispatch({
            type: 'dataCollection/update',
            payload: Object.assign(
              {},
              {
                name,
                dbInstanceId,
                description,
                sqlScript: btoa(encodeURIComponent(sqlScript)),
                tableName,
                cronExpression,
                misfireStrategy,
                arguments: args,
                priorityIds,
                dataDealType,
                warnEmail,
                resultColumns,
                lastRecordFrom,
                lastRecordValue,
                updateColumns,
                updateConditions: dataDealType === 2 ? updateConditions : '',
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
              router.push('/back/dataCollection');
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
    this.setState({
      value,
    });
    dispatch({
      type: 'dataCollection/changeDataType',
      payload: value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      misfireList,
      dbInstanceList,
      detail,
    } = this.props;
    const { value } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    };
    return (
      <Form
        {...formItemLayout}
        style={{ maxWidth: '800px', margin: '0' }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="采集编号">
          {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
        </Form.Item>
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
        <Form.Item label="实例名称">
          {getFieldDecorator('dbInstanceId', {
            initialValue: detail.dbInstanceId,
            rules: [
              {
                required: true,
                message: '请选择实例名称!',
              },
            ],
          })(
            <Select placeholder="请选择" allowClear>
              {dbInstanceList.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="功能描述(非必填)">
          {getFieldDecorator('description', {
            initialValue: detail.description,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="脚本内容">
          {getFieldDecorator('sqlScript', {
            initialValue: detail.sqlScript,
            rules: [
              {
                required: true,
                message: '请输入脚本内容!',
              },
            ],
          })(<Input.TextArea placeholder="请输入" autosize={{ minRows: 2 }} />)}
        </Form.Item>
        <Form.Item
          label="采集参数(非必填)"
          extra={`如：${JSON.stringify({ name: 'zhang', phone: '15961311111' })}`}
        >
          {getFieldDecorator('args', {
            initialValue: detail.arguments,
          })(<Input placeholder="请输入采集参数" />)}
        </Form.Item>
        <Form.Item label="对应关系" extra="如：name,phone,address">
          {getFieldDecorator('resultColumns', {
            initialValue: detail.resultColumns,
          })(<Input placeholder="请输入对应关系" />)}
        </Form.Item>
        <Form.Item label="上次采集字段">
          {getFieldDecorator('lastRecordFrom', {
            initialValue: detail.lastRecordFrom,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="上次采集时间">
          {getFieldDecorator('lastRecordValue', {
            initialValue: detail.lastRecordValue,
          })(<Input placeholder="上次采集时间" />)}
        </Form.Item>
        <Divider dashed style={{ borderTopColor: '#999', width: '1000px' }} />
        <Form.Item label="表名称">
          {getFieldDecorator('tableName', {
            initialValue: detail.tableName,
            rules: [
              {
                required: true,
                message: '请输入表名称!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="数据处理">
          {getFieldDecorator('dataDealType', {
            initialValue: detail.dataDealType,
          })(
            <Radio.Group onChange={this.dataChange}>
              <Radio value={0}>新增</Radio>
              <Radio value={1}>替换</Radio>
              <Radio value={2}>更新</Radio>
              <Radio value={3}>插入更新</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <div>
          {value === 2 || value === 2 || detail.dataDealType === 2 || detail.dataDealType === 3 ? (
            <Form.Item label="更新字段">
              {getFieldDecorator('updateColumns', {
                initialValue: detail.updateColumns,
              })(<Input placeholder="请输入字段，支持多个字段（逗号分隔）" />)}
            </Form.Item>
          ) : null}
          {value === 2 || detail.dataDealType === 2 ? (
            <Form.Item label="更新条件">
              {getFieldDecorator('updateConditions', {
                initialValue: detail.updateConditions,
              })(<Input placeholder="请输入条件，支持多个条件（逗号分隔）" />)}
            </Form.Item>
          ) : null}
        </div>
        <Divider dashed style={{ borderTopColor: '#999', width: '1000px' }} />
        <Form.Item label="调度规则">
          <Row gutter={8}>
            <Form.Item label="Cron表达式">
              {getFieldDecorator('cronExpression', {
                initialValue: detail.cronExpression,
                rules: [
                  {
                    required: true,
                    message: '请输入Cron表达式!',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Misfire策略">
                {getFieldDecorator('misfireStrategy', {
                  initialValue: detail.misfireStrategy,
                  rules: [
                    {
                      required: true,
                      message: '请选择Misfire策略!',
                    },
                  ],
                })(
                  <Select placeholder="请选择" allowClear>
                    {misfireList.map(type => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="采集条件(非必填)" extra="在该采集完成之后才能开始采集">
          {getFieldDecorator('priorityIds', {
            initialValue: detail.priorityIds,
          })(<Input placeholder="请输入采集编号，支持多个编号（逗号分隔）" />)}
        </Form.Item>
        <Form.Item label="预警通知">
          {getFieldDecorator('warnEmail', {
            initialValue: detail.warnEmail,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Detail;
