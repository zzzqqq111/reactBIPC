/**
 *  指标库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  notification,
  Tabs,
  Select,
  Row,
  Col,
  message,
  Table,
  Cascader,
} from 'antd';
import router from 'umi/router';

const { Option } = Select;
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

@connect(({ tableStructure, loading, global }) => ({
  detail: tableStructure.detail,
  detailLoading: loading.effects['tableStructure/fetchDetail'],
  infoDetaial: tableStructure.infoDetaial,
  listLoading: loading.effects['tableStructure/fetchDetail'],
  fieldsList: tableStructure.fieldsList,
  dataBaseList: tableStructure.dataBaseList,
  categoryList: tableStructure.categoryList,
  selectTypes: global.selectTypes,
}))
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'success',
      statusName: 'success',
      type: '',
      fileName: '',
      createTable: '',
      dbName: '',
      editName: { id: '', show: false },
      descriptContent: { id: '', show: false },
      selectorValue: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.id) {
      dispatch({
        type: 'tableStructure/fetchDetail',
        payload: { tableStructureId: query.id },
      });
      dispatch({
        type: 'tableStructure/fetchFieldsList',
        payload: { tableStructureId: query.id },
      });
    } else {
      dispatch({
        type: 'tableStructure/resetDetail',
      });
    }
    dispatch({
      type: 'tableStructure/tableCatList',
      payload: { isEnable: true },
    });
    dispatch({
      type: 'tableStructure/fetchDataBaseList',
    });
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
      detail = {},
    } = this.props;
    const { dbName } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      // 新增、编辑都在这里处理 编辑多传一个id
      if (!err) {
        if (!query.id) {
          dispatch({
            type: 'tableStructure/save',
            payload: {
              tableName: values.tableName,
              define: values.define,
              sql: btoa(encodeURIComponent(values.sql)),
              dataDbId: values.dataDbId,
              tableTypeId: values.name[1] ? values.name[1] : '',
              databaseName: dbName,
            },
            callback: () => {
              notification.success({
                message: '保存成功',
              });
              router.push('/back/tableStructure');
            },
          });
        } else {
          dispatch({
            type: 'tableStructure/update',
            payload: {
              dataDbId: values.dataDbId,
              databaseName: detail.databaseName,
              tableTypeId: values.name[1] ? values.name[1] : '',
              id: query.id,
            },
            callback: () => {
              notification.success({
                message: '保存成功',
              });
              router.push('/back/tableStructure');
            },
          });
        }
      }
    });
  };

  // 失去焦点判断是否名称已存在
  inputOnBlur = e => {
    const { id, value } = e.target;
    const { dispatch } = this.props;
    const { dbName } = this.state;
    if (id === 'tableName') {
      this.setState({
        createTable: value && value !== '' ? `CREATE TABLE ${value}` : '',
      });
    }
    if (value === '') {
      this.setState({
        status: 'success',
      });
      return;
    }
    dispatch({
      type: 'tableStructure/fetchFilterList',
      payload: { [id]: value, dataBaseName: dbName },
    }).then(res => {
      if (res && res.length !== 0) {
        if (id === 'tableName') {
          this.setState({
            status: 'error',
          });
        }
        if (id === 'define') {
          this.setState({
            statusName: 'error',
          });
        }
      } else {
        this.setState({
          status: 'success',
          statusName: 'success',
        });
      }
    });
  };

  onChange = value => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (value === '2') {
      dispatch({
        type: 'tableStructure/getFiledsInfo',
        payload: { tableStructureId: query.id },
      });
    }
  };

  onFiledchange = value => {
    // 选中字段后自动填充字段类型
    const { infoDetaial } = this.props;
    this.setState({
      type: infoDetaial[value],
      fileName: value,
    });
  };

  onSelecorChange = (id, field, value) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { selectorValue } = this.state;
    dispatch({
      type: 'tableStructure/updateFieldAtrribute',
      payload: { tableFieldId: id, [field]: value, selectorValue },
      callback: () => {
        message.success('修改成功');
        dispatch({
          type: 'tableStructure/fetchFieldsList',
          payload: { tableStructureId: query.id },
        });
      },
    });
  };

  // 选择库
  dbNameChange = (value, option) => {
    const { label } = option.props;
    this.setState({
      dbName: label,
    });
  };

  // 是否显示中文名文本框
  editName = id => {
    this.setState({
      editName: { id, show: true },
    });
  };

  // 是否显示描述文本框
  editDescript = id => {
    this.setState({
      descriptContent: { id, show: true },
    });
  };

  // 修改中文ing
  handleFieldChange = (e, fieldName, key) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { value } = e.target;
    if (value === '') {
      return;
    }
    dispatch({
      type: 'tableStructure/updateFieldAlias',
      payload: { [fieldName]: value, id: key },
      callback: () => {
        message.success('修改成功');
        dispatch({
          type: 'tableStructure/fetchFieldsList',
          payload: { tableStructureId: query.id },
        });
      },
    });
  };

  // 修改描述信息
  handleFieldSelectorChange = (e, fieldName, key) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { value } = e.target;
    if (value === '') {
      return;
    }
    dispatch({
      type: 'tableStructure/updateFieldAtrribute',
      payload: { tableFieldId: key, define: value },
      callback: () => {
        message.success('修改成功');
        this.setState({
          descriptContent: { id: '', show: false },
        });
        dispatch({
          type: 'tableStructure/fetchFieldsList',
          payload: { tableStructureId: query.id },
        });
      },
    });
  };

  setSelecrValue = (e, id, text) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { value } = e.target;
    if (value === '') return;
    dispatch({
      type: 'tableStructure/updateFieldAtrribute',
      payload: { tableFieldId: id, selector: text, selectorValue: btoa(encodeURIComponent(value)) },
      callback: () => {
        message.success('修改成功');
        dispatch({
          type: 'tableStructure/fetchFieldsList',
          payload: { tableStructureId: query.id },
        });
      },
    });
  };

  // 渲染编辑信息字段
  renderTab = () => {
    return (
      <Tabs defaultActiveKey="1" animated={false} onChange={this.onChange}>
        <TabPane tab="新增字段" key="1">
          {this.renderTabContent1()}
        </TabPane>
        <TabPane tab="修改字段" key="2">
          {this.renderTabContent2()}
        </TabPane>
        <TabPane tab="编辑索引" key="3">
          {this.renderTabContent3()}
        </TabPane>
        <TabPane tab="清理数据" key="4">
          {this.renderTabContent4()}
        </TabPane>
      </Tabs>
    );
  };

  renderTabContent1 = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const TabConent1 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          dispatch({
            type: 'tableStructure/addFileds',
            payload: { ...fieldsValue, tableStructureId: query.id },
            callback: () => {
              dispatch({
                type: 'tableStructure/fetchDetail',
                payload: { tableStructureId: query.id },
              }).then(() => {
                message.success('添加成功');
              });
            },
          });
        });
      };
      return (
        <Form>
          <Form.Item label="字段名">
            {getFieldDecorator('fieldName')(<Input placeholder="请输入字段名" />)}
          </Form.Item>
          <Form.Item label="字段类型">
            {getFieldDecorator('fieldType')(<Input placeholder="请输入字段类型" />)}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={submitBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    });
    return <TabConent1 />;
  };

  renderTabContent2 = () => {
    const {
      dispatch,
      location: { query },
      infoDetaial,
    } = this.props;
    const { type, fileName } = this.state;
    if (!infoDetaial) {
      return null;
    }
    const name = Object.keys(infoDetaial) || [];
    const TabConent2 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const value = {
            ...fieldsValue,
            tableStructureId: query.id,
            fieldType: type,
          };
          if (fieldsValue.fieldType) {
            // eslint-disable-next-line no-useless-escape
            const regex = /\([^\)]*\)/g;
            if (regex.test(type)) {
              value.fieldType = type.replace(regex, `(${fieldsValue.fieldType})`);
            }
          }
          dispatch({
            type: 'tableStructure/updataFileds',
            payload: value,
            callback: () => {
              dispatch({
                type: 'tableStructure/fetchDetail',
                payload: { tableStructureId: query.id },
              }).then(() => {
                message.success('修改成功');
              });
              dispatch({
                type: 'tableStructure/getFiledsInfo',
                payload: { tableStructureId: query.id },
              });
              this.setState({
                type: '',
                fileName: '',
              });
            },
          });
        });
      };
      return (
        <Form>
          <Form.Item label="原字段名">
            {getFieldDecorator('fieldName', {
              initialValue: fileName,
              rules: [
                {
                  required: true,
                  message: '请选择字段!',
                },
              ],
            })(
              <Select placeholder="请选择字段" onChange={this.onFiledchange}>
                <Option value="">请选择字段</Option>
                {name.map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="新字段名">
            {getFieldDecorator('updateFieldName', {
              rules: [
                {
                  required: true,
                  message: '请填写字段名!',
                },
              ],
            })(<Input placeholder="请输入新字段名" />)}
          </Form.Item>
          <Form.Item label="原字段类型">
            <Input placeholder="原字段类型" disabled value={type} />
          </Form.Item>
          <Form.Item label="字段类型" help="只允许输入数字">
            {getFieldDecorator('fieldType', {
              rules: [
                {
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                },
              ],
            })(<Input placeholder="输入新的长度," />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={submitBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    });
    return <TabConent2 />;
  };

  renderTabContent3 = () => {
    const {
      dispatch,
      location: { query },
      detail,
    } = this.props;
    const TabConent3 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const value = {
            index: btoa(encodeURIComponent(fieldsValue.index)),
            tableStructureId: query.id,
          };
          dispatch({
            type: 'tableStructure/updataIndex',
            payload: value,
            callback: () => {
              dispatch({
                type: 'tableStructure/fetchDetail',
                payload: { tableStructureId: query.id },
              }).then(() => {
                message.success('修改成功');
              });
            },
          });
        });
      };
      return (
        <Form>
          <Form.Item label={`索引:    alter    table     ${detail.tableName}`} colon={false}>
            {getFieldDecorator('index')(<Input.TextArea placeholder="请填写索引" autosize />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={submitBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    });
    return <TabConent3 />;
  };

  renderTabContent4 = () => {
    const {
      dispatch,
      location: { query },
      detail,
    } = this.props;
    const TabConent3 = Form.create()(props => {
      const { form } = props;
      const { getFieldDecorator } = form;
      const submitBtn = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const value = {
            conditions: btoa(encodeURIComponent(fieldsValue.conditions)),
            tableStructureId: query.id,
          };
          dispatch({
            type: 'tableStructure/deleteData',
            payload: value,
            callback: () => {
              dispatch({
                type: 'tableStructure/fetchDetail',
                payload: { tableStructureId: query.id },
              }).then(() => {
                message.success('已清理');
              });
            },
          });
        });
      };
      return (
        <Form>
          <Form.Item label={`条件:    delete     from ${detail.tableName} where`} colon={false}>
            {getFieldDecorator('conditions')(
              <Input.TextArea placeholder="请输入清除语句" autosize />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={submitBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    });
    return <TabConent3 />;
  };

  renderFieldsContent = () => {
    const { listLoading, fieldsList = [], selectTypes = [] } = this.props;
    const { editName, descriptContent } = this.state;
    return (
      <Table
        loading={listLoading}
        dataSource={fieldsList}
        rowKey={record => record.tableFieldId}
        columns={[
          {
            title: '表字段',
            dataIndex: 'column_name',
          },
          {
            title: '类型',
            dataIndex: 'column_type',
          },
          {
            title: '中文名',
            dataIndex: 'column_comment',
            render: (text, record) => {
              if ((editName.id === record.tableFieldId && editName.show) || text === '' || !text) {
                return (
                  <Input
                    defaultValue={text}
                    onBlur={e => this.handleFieldChange(e, 'columnComment', record.tableFieldId)}
                    placeholder="中文名"
                  />
                );
              }
              return (
                <div
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'initial',
                  }}
                  onClick={() => {
                    this.editName(record.tableFieldId);
                  }}
                >
                  {text}
                </div>
              );
            },
          },
          {
            title: '属性',
            dataIndex: 'attribute',
            render: (text, record) => (
              <Select
                defaultValue={text || ''}
                onChange={this.onSelecorChange.bind(this, record.tableFieldId, 'attribute')}
                style={{ width: '100px' }}
              >
                <Option value="" disabled>
                  请选择
                </Option>
                <Option value="指标">指标</Option>
                <Option value="维度">维度</Option>
              </Select>
            ),
          },
          {
            title: '描述',
            dataIndex: 'define',
            render: (text, record) => {
              if (
                (descriptContent.id === record.tableFieldId && descriptContent.show) ||
                text === '' ||
                !text
              ) {
                return (
                  <Input.TextArea
                    defaultValue={text}
                    onBlur={e => this.handleFieldSelectorChange(e, 'define', record.tableFieldId)}
                    placeholder="描述"
                  />
                );
              }
              return (
                <div
                  style={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'initial',
                  }}
                  onClick={() => {
                    this.editDescript(record.tableFieldId);
                  }}
                >
                  {text}
                </div>
              );
            },
          },
          {
            title: '选择器',
            dataIndex: 'selector',
            width: '200px',
            render: (text, record) => {
              return (
                <div>
                  <Select
                    placeholder="请选择"
                    allowClear
                    defaultValue={text || ''}
                    onChange={this.onSelecorChange.bind(this, record.tableFieldId, 'selector')}
                    style={{ width: '100px' }}
                  >
                    <Option value="">无</Option>
                    {selectTypes.map(type => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                  {text === '下拉框选择' ? (
                    <Input
                      defaultValue={record.selectorValue}
                      placeholder="输入获取下拉内容的sql"
                      onBlur={e => {
                        this.setSelecrValue(e, record.tableFieldId, text);
                      }}
                      style={{ marginTop: '10px' }}
                    />
                  ) : null}
                </div>
              );
            },
          },
        ]}
        pagination={false}
      />
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      detail,
      location: { query },
      dataBaseList = [],
      categoryList = [],
    } = this.props;
    const { status, statusName, createTable } = this.state;
    return (
      <div>
        <Row>
          <Col span={2} offset={22}>
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
        <Form
          style={{ maxWidth: '1000px', margin: 0 }}
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="库名">
            {getFieldDecorator('dataDbId', {
              initialValue: detail.dataDbId || '',
              rules: [
                {
                  required: true,
                  message: '请选择库!',
                },
              ],
            })(
              <Select placeholder="请选择库" onChange={this.dbNameChange} disabled={!!query.id}>
                <Option value="" disabled>
                  请选择库
                </Option>
                {dataBaseList.map(item => (
                  <Option value={item.id} key={item.id} label={item.dbName}>
                    {item.alias}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label="表名称"
            validateStatus={status}
            help={status === 'error' ? '表名不能重复' : ''}
          >
            {getFieldDecorator('tableName', {
              initialValue: detail.tableName || '',
              rules: [
                {
                  required: true,
                  message: '请输入表名称!',
                },
              ],
            })(
              <Input
                placeholder="请输入"
                onBlur={this.inputOnBlur}
                disabled={!!query.id}
                id={status}
              />
            )}
          </Form.Item>
          <Form.Item
            label="中文名称"
            validateStatus={statusName}
            help={statusName === 'error' ? '表名不能重复' : ''}
          >
            {getFieldDecorator('define', {
              initialValue: detail.define,
              // rules: [
              //   {
              //     required: true,
              //     message: '请输入中文名称!',
              //   },
              // ],
            })(
              <Input
                placeholder="请输入"
                // onBlur={this.inputOnBlur}
                disabled={!!query.id}
                id={statusName}
              />
            )}
          </Form.Item>
          <Form.Item label="表分类">
            {getFieldDecorator('name', {
              initialValue: detail.channel ? [detail.channel, detail.tableType] : '',
              rules: [
                {
                  required: true,
                  message: '请选择分类!',
                },
              ],
            })(<Cascader options={categoryList} placeholder="请选择分类" />)}
          </Form.Item>
          <div style={{ marginLeft: '13%' }}> {createTable}</div>
          <Form.Item label="脚本内容">
            {getFieldDecorator('sql', {
              initialValue: detail.showTable,
              rules: [
                {
                  required: true,
                  message: '请输入脚本内容!',
                },
              ],
            })(<Input.TextArea placeholder="脚本内容" autosize disabled={!!query.id} />)}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
        <div style={{ maxWidth: '1000px', margin: 0 }}>{query.id ? this.renderTab() : null}</div>
        <div style={{ maxWidth: '1000px', margin: 0 }}>
          {query.id ? this.renderFieldsContent() : null}
        </div>
      </div>
    );
  }
}

export default Detail;
