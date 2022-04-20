/**
 * 编辑报表
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Radio } from 'antd';
// import TableTransfer from '../components/TableTransfer';

@connect(({ customReport, compareReport }) => ({
  firstReport: customReport.firstReport,
  report: customReport.report,
  compareData: compareReport.compareData,
}))
@Form.create()
class CompareIndicatorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setFieldsValue = (options = {}) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue(options);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
              <Form.Item label="指标名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入指标名称' }],
                })(<Input placeholder="请输入指标名称" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="指标公式=" extra='(按列进行运算，"+","-","×","/","()")'>
                {getFieldDecorator('formula', {
                  rules: [{ required: true, message: '请输入指标公式' }],
                })(<Input placeholder="请输入指标公式" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Col span={24}>
                <Form.Item label="数据格式">
                  {getFieldDecorator('format', {
                    initValue: 1,
                    rules: [{ required: true, message: '请选择数据格式' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>数字</Radio>
                      <Radio value={2}>百分比</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const CompareIndicatorForm = Form.create()(CompareIndicatorEdit);

export default CompareIndicatorForm;
