/**
 * 编辑报表
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Cascader, Divider, Radio } from 'antd';
import TableTransfer from './components/TableTransfer';

@connect(({ customReport }) => ({
  indicatorTypeList: customReport.indicatorTypeList,
  list: customReport.list,
  // menuEditList: customReport.menuEditList,
  firstReport: customReport.firstReport,
  detail: customReport.detail,
}))
@Form.create()
class EditReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
    };
  }

  componentDidMount() {
    const { dispatch, firstReport } = this.props;
    dispatch({
      type: 'customReport/fetchIndicatorTypeList',
    });
    if (firstReport.indicatorsTypeId && firstReport.indicatorsTypeId !== 0) {
      dispatch({
        type: 'customReport/fetchDetail',
        payload: { id: firstReport.indicatorsTypeId },
      }).then(res => {
        dispatch({
          type: 'customReport/fetchList',
          payload: {
            channel: res.channel,
            dataDimension: res.dataDimension,
            dataParticles: res.dataParticles,
            isEnable: true,
            pageSize: 1000,
          },
        });
      });
    }
  }

  componentWillReceiveProps = nextProps => {
    const {
      firstReport: { customReport = {} },
    } = nextProps;
    if (customReport.indicatorsIds && customReport.indicatorsIds.length !== 0) {
      this.setState({
        targetKeys: JSON.parse(customReport.indicatorsIds),
      });
    }
  };

  onChange = nextTargetKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customReport/updateIndicatorsIds',
      payload: {
        indicatorsIds: JSON.stringify(nextTargetKeys),
      },
    });
  };

  changeIndicator = value => {
    const { dispatch } = this.props;
    const obj1 = {
      channel: value[0],
      dataParticles: value[1],
      dataDimension: value[2],
      isEnable: true,
      pageSize: 1000,
    };
    dispatch({
      type: 'customReport/fetchList',
      payload: obj1,
    });
    dispatch({
      type: 'customReport/updateIndicatorsIds',
      payload: {
        indicatorsIds: '[]',
      },
    });
    dispatch({
      type: 'customReport/saveDetail',
      payload: { channel: value[0], dataParticles: value[1], dataDimension: value[2] },
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
      const { dispatch } = this.props;
      dispatch({
        type: 'customReport/updateIndicatorsIds',
        payload: {
          indicatorsIds: JSON.stringify(targetKeys),
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
      const { dispatch } = this.props;
      dispatch({
        type: 'customReport/updateIndicatorsIds',
        payload: {
          indicatorsIds: JSON.stringify(targetKeys),
        },
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      indicatorTypeList,
      list = [],
      // menuEditList,
      firstReport,
      detail = {},
    } = this.props;
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

    return (
      <div>
        <Form {...formItemLayout} hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="报表名称">
                {getFieldDecorator('name', {
                  initialValue: firstReport.name,
                  rules: [{ required: true, message: '请输入名称' }],
                })(<Input placeholder="请输入名称" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="报表编号">
                {getFieldDecorator('reportNo', {
                  initialValue: firstReport.reportNo,
                  rules: [{ required: true, message: '请输入报表编号' }],
                })(<Input placeholder="请输入报表编号" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="选择模板">
                <Radio.Group defaultValue={1}>
                  <Radio value={1}>模板1</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {/* <Col span={24}>
              <Form.Item label="存储目录">
                {getFieldDecorator('parentId', {
                  initialValue: firstReport.parentId,
                  rules: [{ required: true, message: '请选择目录' }],
                })(<Cascader placeholder="请选择目录" options={menuEditList} />)}
              </Form.Item>
            </Col> */}
            <Col span={24}>
              <Form.Item label="指标分类">
                {getFieldDecorator('indictorId', {
                  initialValue: [
                    detail.channel || '',
                    detail.dataParticles || '',
                    detail.dataDimension || '',
                  ],
                })(
                  <Cascader
                    placeholder="请选择指标渠道/数据颗粒/数据维度 "
                    options={indicatorTypeList || []}
                    onChange={this.changeIndicator}
                  />
                )}
              </Form.Item>
            </Col>
            {!detail.channel ? null : (
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('indicatorsIds')(
                    <TableTransfer
                      titles={['未选目标', '已选目标']}
                      dataSource={list.map(item => {
                        return {
                          ...item,
                          key: item.id,
                        };
                      })}
                      targetKeys={targetKeys}
                      onChange={this.onChange}
                      showSearch
                      filterOption={(inputValue, item) =>
                        item.type.indexOf(inputValue) !== -1 || item.name.indexOf(inputValue) !== -1
                      }
                      leftColumns={[
                        {
                          dataIndex: 'type',
                          title: '业务类型',
                        },
                        {
                          dataIndex: 'name',
                          title: '指标名称',
                        },
                      ]}
                      rightColumns={[
                        {
                          dataIndex: 'name',
                          title: '指标名称',
                        },
                        {
                          title: '操作',
                          render: (_, record) => (
                            <span>
                              <a onClick={this.onMoveUp.bind(this, record)}>上移</a>
                              <Divider type="vertical" />
                              <a onClick={this.onMoveDown.bind(this, record)}>下移</a>
                            </span>
                          ),
                        },
                      ]}
                    />
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </div>
    );
  }
}

const WrapperForm = Form.create()(EditReport);

export default WrapperForm;
