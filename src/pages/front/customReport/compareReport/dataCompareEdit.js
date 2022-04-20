/**
 * 编辑报表
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Divider } from 'antd';
import TableTransfer from '../components/TableTransfer';

@connect(({ customReport, compareReport }) => ({
  firstReport: customReport.firstReport,
  report: customReport.report,
  compareData: compareReport.compareData,
}))
@Form.create()
class DataCompareReportEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      dateFixId: 0,
    };
  }

  componentDidMount = () => {
    const { report = [], compareData = {} } = this.props;
    const ListObj = {};
    report.forEach(col => {
      const { selector } = col;
      if (selector) {
        if (ListObj[selector]) {
          ListObj[selector].push(col);
        } else {
          ListObj[selector] = [selector, col];
        }
      }
    });
    if (ListObj['时间选择']) {
      ListObj['时间选择'].forEach((li, j) => {
        if (j !== 0) {
          this.setState({
            targetKeys: [li.id],
            dateFixId: li.id,
          });
        }
      });
    }
    if (compareData.indicatorsId && compareData.indicatorsId !== '[]') {
      this.setState({
        targetKeys: JSON.parse(compareData.indicatorsId),
      });
    }
  };

  componentWillReceiveProps = nextProps => {
    const { compareData = {} } = nextProps;
    const { dateFixId } = this.state;
    if (compareData.indicatorsId && compareData.indicatorsId !== '[]') {
      this.setState({
        targetKeys: JSON.parse(compareData.indicatorsId),
      });
    } else {
      this.setState({
        targetKeys: [dateFixId],
      });
    }
  };

  onChange = nextTargetKeys => {
    const { dispatch } = this.props;
    const { dateFixId } = this.state;
    nextTargetKeys.map((item, index) => {
      if (item === dateFixId) {
        nextTargetKeys.splice(index, 1);
      }
      if (item === 0) {
        nextTargetKeys.splice(index, 1);
      }
      return item;
    });
    nextTargetKeys.unshift(dateFixId);
    dispatch({
      type: 'compareReport/updateCompareIndicatorsIds',
      payload: JSON.stringify(nextTargetKeys),
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
        type: 'compareReport/updateCompareIndicatorsIds',
        payload: JSON.stringify(targetKeys),
      });
      this.setState({
        targetKeys,
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
        type: 'compareReport/updateCompareIndicatorsIds',
        payload: JSON.stringify(targetKeys),
      });
      this.setState({
        targetKeys,
      });
    }
  };

  setFieldsValue = (options = {}) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue(options);
  };

  render() {
    const {
      form: { getFieldDecorator },
      report = [],
    } = this.props;
    const { targetKeys, dateFixId } = this.state;
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
              <Form.Item label="数据对比">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入名称' }],
                })(<Input placeholder="请输入名称" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('indicatorsIds')(
                  <TableTransfer
                    titles={['未选目标', '已选目标']}
                    dataSource={report.map(item => {
                      return {
                        ...item,
                        key: item.id,
                      };
                    })}
                    targetKeys={targetKeys}
                    onChange={this.onChange}
                    showSearch
                    fixId={dateFixId}
                    leftColumns={[
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
                        render: (_, record) =>
                          record.id === dateFixId ? null : (
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
          </Row>
        </Form>
      </div>
    );
  }
}

const DataWrapperForm = Form.create()(DataCompareReportEdit);

export default DataWrapperForm;
