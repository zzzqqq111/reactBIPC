/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  notification,
  Row,
  Col,
  Select,
  Table,
  Divider,
  Typography,
} from 'antd';
import router from 'umi/router';

const { TextArea } = Input;
const { Option } = Select;
const { Paragraph } = Typography;

@connect(({ apiManage, loading }) => {
  return {
    detail: apiManage.detail,
    detailLoading: loading.effects['apiManage/fetchDetail'],
  };
})
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: [],
      editShow: { id: 0, show: false },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.id) {
      dispatch({
        type: 'apiManage/fetchDetail',
        payload: { id: query.id },
      });
    } else {
      dispatch({
        type: 'apiManage/resetDetail',
      });
    }
  }

  componentWillReceiveProps = nextProps => {
    const { detail = {} } = nextProps;
    const { parameter = [] } = detail;
    if (parameter && parameter.length !== 0) {
      this.setState({
        params: parameter,
      });
    }
  };

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    const { params } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'apiManage/update',
          payload: {
            ...values,
            selectScript: btoa(encodeURIComponent(values.selectScript)),
            parameter: JSON.stringify(params),
            // sort: values.sort ? btoa(encodeURIComponent(values.sort)) : '',
          },
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/back/apiManage');
          },
        });
      }
    });
  };

  addField = () => {
    const { params, editShow } = this.state;
    const { dispatch } = this.props;
    const $this = this;
    const index = params.findIndex(key => key.id === editShow.id);
    const TabConent3 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          params.push(fieldsValue);
          dispatch({
            type: 'apiManage/changeParams',
            payload: params,
          });
          this.setState({
            params,
          });
        });
      };
      const updateBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const newItem = Object.assign({}, params[index], fieldsValue);
          params[index] = newItem;
          this.setState({
            params,
          });
        });
        $this.setState({
          editShow: {
            id: 0,
            show: false,
          },
        });
      };
      return (
        <Form>
          <Row>
            <Col span={6} style={{ marginRight: '10px' }}>
              <Form.Item>
                {getFieldDecorator('name', {
                  initialValue: params[index] ? params[index].name : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入脚本内容!',
                    },
                  ],
                })(<Input placeholder="请输入名称" rows={5} />)}
              </Form.Item>
            </Col>
            <Col span={6} style={{ marginRight: '10px' }}>
              <Form.Item>
                {getFieldDecorator('ifRequired', {
                  initialValue: params[index] ? params[index].ifRequired : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入脚本内容!',
                    },
                  ],
                })(
                  <Select placeholder="是否必填">
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator('conditional', {
                  initialValue: params[index] ? params[index].conditional : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入脚本内容!',
                    },
                  ],
                })(<Input placeholder="条件语句" rows={5} />)}
              </Form.Item>
            </Col>
            {editShow.show ? (
              <Col span={4} style={{ textAlign: 'right', marginLeft: '5px' }}>
                <Button type="primary" onClick={updateBtn}>
                  保存
                </Button>
              </Col>
            ) : (
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={submitBtn}>
                  添加
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      );
    });
    return <TabConent3 />;
  };

  deleteParam = id => {
    const { params } = this.state;
    const index = params.findIndex(key => key.id === id);
    params.splice(index, 1);
    this.setState({
      params,
    });
  };

  edit = id => {
    this.setState({
      editShow: { id, show: true },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      detail = {},
    } = this.props;
    const { apiReport = {} } = detail;
    const { params } = this.state;
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
        <Form.Item label="ID">
          {getFieldDecorator('id', {
            initialValue: apiReport.id || '',
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="编号">
          {getFieldDecorator('reportNo', {
            initialValue: apiReport.reportNo || '',
            rules: [
              {
                required: true,
                message: '请输入脚本内容!',
              },
            ],
          })(<Input placeholder="请输入编号" />)}
        </Form.Item>
        <Form.Item label="说明">
          {getFieldDecorator('description', {
            initialValue: apiReport.description,
          })(<TextArea placeholder="请输入说明" rows={5} />)}
        </Form.Item>
        <Form.Item label="参数">
          {this.addField()}
          <Table
            columns={[
              {
                key: 1,
                dataIndex: 'name',
                title: '名称',
              },
              {
                key: 2,
                dataIndex: 'ifRequired',
                title: '是否必填',
              },
              {
                key: 3,
                dataIndex: 'conditional',
                title: '条件语句',
                render: text => (
                  <div style={{ width: '200px' }}>
                    <Paragraph
                      style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 0 }}
                      ellipsis={{ rows: 5 }}
                    >
                      {text}
                    </Paragraph>
                  </div>
                ),
              },
              {
                key: 4,
                title: '操作',
                render: (_, record) => {
                  return (
                    <div>
                      <a
                        onClick={() => {
                          this.edit(record.id);
                        }}
                      >
                        编辑
                      </a>
                      <Divider type="vertical" />
                      <a
                        onClick={() => {
                          this.deleteParam(record.id);
                        }}
                      >
                        删除
                      </a>
                    </div>
                  );
                },
              },
            ]}
            dataSource={params}
            rowKey={record => record.id}
            pagination={false}
          />
        </Form.Item>
        <Form.Item label="查询语句">
          {getFieldDecorator('selectScript', {
            initialValue: apiReport.selectScript,
            rules: [
              {
                required: true,
                message: '请输入脚本内容!',
              },
            ],
          })(<TextArea placeholder="请输入脚本内容" rows={10} />)}
        </Form.Item>
        <Form.Item label="排序">
          {getFieldDecorator('sort', {
            initialValue: apiReport.sort,
          })(<Input placeholder="请输入排序的语句" />)}
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
