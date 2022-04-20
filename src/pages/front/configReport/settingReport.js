/**
 * 编辑报表
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Divider, Select, Icon, Cascader } from 'antd';
import TableTransfer from '../components/TableTransfer';

const { Option } = Select;
// const report = [{ name: '123', id: 1 }, { name: '12312', id: 2 }];
@connect(({ report }) => ({
  list: report.list,
  reportInfo: report.reportInfo,
  detail: report.detail,
  dataSourcelist: report.dataSourcelist,
  typelist: report.typelist,
}))
@Form.create()
class EditReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetchList',
    });
  };

  componentWillReceiveProps = nextProps => {
    const { reportInfo = {} } = nextProps;
    const { indicatorIds = [] } = reportInfo;
    const arr = [];
    if (indicatorIds.length !== 0) {
      indicatorIds.forEach(item => {
        arr.push(`${item.id}`);
      });
    }
    this.setState({
      targetKeys: arr,
    });
  };

  onChange = nextTargetKeys => {
    const {
      dispatch,
      reportInfo: { indicatorIds = [] },
    } = this.props;
    const newIndicators = [];
    nextTargetKeys.forEach(item => {
      const oneArr = indicatorIds.find(key => Number(key.id) === Number(item));
      if (oneArr) {
        newIndicators.push({ id: `${item}`, expression: oneArr.expression });
      } else {
        newIndicators.push({ id: `${item}`, expression: '' });
      }
    });
    dispatch({
      type: 'report/updateIndicatorsIds',
      payload: {
        indicators: JSON.stringify(newIndicators),
      },
    });
  };

  // 上移
  onMoveUp = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    const { key } = item;
    const { targetKeys } = this.state;
    const index = targetKeys.indexOf(key);
    if (index > 0) {
      const upperKey = targetKeys[index - 1];
      targetKeys[index - 1] = key;
      targetKeys[index] = upperKey;
      const {
        dispatch,
        reportInfo: { indicatorIds = [] },
      } = this.props;
      const newArr = [];
      targetKeys.forEach(one => {
        indicatorIds.forEach(order => {
          if (one === `${order.id}`) {
            newArr.push(order);
          }
        });
      });
      dispatch({
        type: 'report/updateIndicatorsIds',
        payload: {
          indicators: JSON.stringify(newArr),
        },
      });
    }
  };

  // 下移
  onMoveDown = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    const { key } = item;
    const { targetKeys } = this.state;
    const index = targetKeys.indexOf(key);
    if (index < targetKeys.length - 1) {
      const nextKey = targetKeys[index + 1];
      targetKeys[index + 1] = key;
      targetKeys[index] = nextKey;
      const {
        dispatch,
        reportInfo: { indicatorIds = [] },
      } = this.props;
      const newArr = [];
      targetKeys.forEach(one => {
        indicatorIds.forEach(order => {
          if (one === `${order.id}`) {
            newArr.push(order);
          }
        });
      });
      dispatch({
        type: 'report/updateIndicatorsIds',
        payload: {
          indicators: JSON.stringify(newArr),
        },
      });
    }
  };

  caculateChange = (id, name, value) => {
    const {
      dispatch,
      reportInfo: { indicatorIds = [] },
    } = this.props;
    const index = indicatorIds.findIndex(key => Number(key.id) === Number(id));
    if (value === '') {
      indicatorIds[index].expression = '';
    } else {
      indicatorIds[index].expression = `${value}(${name})`;
    }
    dispatch({
      type: 'report/updateIndicatorsIds',
      payload: {
        indicators: JSON.stringify(indicatorIds),
      },
    });
  };

  showOthersType = value => {
    const { dispatch, form } = this.props;
    if (value && value.length !== 0) {
      const dbName = value[1].split('.');
      dispatch({
        type: 'report/fetchTypeList',
        payload: {
          databaseName: dbName[0],
          tableName: dbName[1],
        },
        callback: () => {
          // 改变数据库，并清空维度，指标
          dispatch({
            type: 'report/getDataSource',
            payload: {
              dataSource: dbName,
            },
          });
          form.setFieldsValue({
            dimensions: [],
          });
        },
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      reportInfo,
      dataSourcelist = [],
      typelist = {},
    } = this.props;
    const { indicatorIds = [], dataSource } = reportInfo;
    const { dimensions = [], indicators = [] } = typelist;
    const { targetKeys } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const filter = (inputValue, path) => {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    };
    return (
      <div>
        <Form {...formItemLayout} hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="报表名称" extra="最多只允许输入10个字">
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入名称' },
                    { max: 10, message: '不能超过10个字' },
                  ],
                })(<Input placeholder="请输入名称" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="报表编号">
                {getFieldDecorator('number', {})(
                  <Input placeholder="请输入编号" disabled={!reportInfo.number} />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="数据源">
                {getFieldDecorator('dataSource', {
                  rules: [{ required: true, message: '请选择数据源' }],
                })(
                  <Cascader
                    options={dataSourcelist}
                    onChange={this.showOthersType}
                    placeholder="请选择数据库/表名"
                    showSearch={{ filter }}
                  />
                )}
              </Form.Item>
            </Col>
            {dataSource ? (
              <Col span={24}>
                <Form.Item label="维度">
                  {getFieldDecorator('dimensions', {
                    // initialValue: reportInfo.dimensions,
                  })(
                    <Select
                      mode="multiple"
                      placeholder="请选择维度"
                      onChange={this.handleChange}
                      style={{ width: '100%' }}
                      showArrow
                    >
                      {dimensions.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.COLUMN_COMMENT || item.column_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            ) : null}
            {dataSource ? (
              <Col span={24}>
                <Form.Item label="指标">
                  {getFieldDecorator('indicators')(
                    <TableTransfer
                      titles={['未选目标', '已选目标']}
                      dataSource={indicators.map(item => ({
                        ...item,
                        key: `${item.id}`,
                        id: `${item.id}`,
                      }))}
                      targetKeys={targetKeys}
                      onChange={this.onChange}
                      showSearch
                      filterOption={(inputValue, item) =>
                        item.type.indexOf(inputValue) !== -1 || item.name.indexOf(inputValue) !== -1
                      }
                      leftColumns={[
                        {
                          dataIndex: 'COLUMN_COMMENT',
                          title: '字段名称',
                          width: '80%',
                          render: (text, record) => (
                            <div
                              style={{
                                wordWrap: 'break-word',
                                wordBreak: 'break-all',
                                whiteSpace: 'initial',
                              }}
                            >
                              {text || record.column_name}
                            </div>
                          ),
                        },
                      ]}
                      rightColumns={[
                        {
                          dataIndex: 'COLUMN_COMMENT',
                          title: '字段名称',
                          width: '35%',
                          render: (text, record) => (
                            <div
                              style={{
                                wordWrap: 'break-word',
                                wordBreak: 'break-all',
                                whiteSpace: 'initial',
                              }}
                            >
                              {text || record.column_name}
                            </div>
                          ),
                        },
                        {
                          title: '计算方式',
                          width: '35%',
                          render: (_, record) => {
                            const value = indicatorIds.find(
                              key => Number(key.id) === Number(record.id)
                            );
                            let calcaulater = '';
                            if (value.expression) {
                              const idnex = value.expression.indexOf('(');
                              calcaulater = value.expression.slice(0, idnex);
                            }
                            return (
                              <Select
                                onChange={this.caculateChange.bind(
                                  this,
                                  record.id,
                                  record.column_name
                                )}
                                id={record.id}
                                defaultValue={calcaulater || ''}
                              >
                                <Option value="">无</Option>
                                <Option value="sum">合计</Option>
                                {/* <Option value="count">数目</Option>
                                <Option value="average">均值</Option> */}
                              </Select>
                              // <Input
                              //   placeholder="计算"
                              //   id={record.id}
                              //   defaultValue={value.expression || ''}
                              //   onBlur={this.caculateChange.bind(this)}
                              // />
                            );
                          },
                        },
                        {
                          title: '操作',
                          width: '5%',
                          render: (_, record) => (
                            <span>
                              <Icon
                                type="arrow-down"
                                onClick={this.onMoveDown.bind(this, record)}
                              />
                              <Divider type="vertical" />
                              <Icon type="arrow-up" onClick={this.onMoveUp.bind(this, record)} />
                            </span>
                          ),
                        },
                      ]}
                    />
                  )}
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        </Form>
      </div>
    );
  }
}

const WrapperForm = Form.create()(EditReport);

export default WrapperForm;
