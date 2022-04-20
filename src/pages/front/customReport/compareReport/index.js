/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-string-refs */
/**
 * 同期对比
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Form, Modal, Tabs, Drawer, notification, Tooltip } from 'antd';
import ExportJsonExcel from 'js-export-excel';
import SelectRangePicker from '../components/SelectCompareRangePicker';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataWrapperForm from './dataCompareEdit';
import CompareIndicatorForm from './compareIndicatorEdit';
import { initExpression } from './customComputed';
import { getNowTime } from '@/utils/timeFormat';

const { confirm } = Modal;
const { TabPane } = Tabs;

const columns = compareDataList => {
  const col = [];
  const col1 = [];
  if (compareDataList && compareDataList.length !== 0) {
    compareDataList.forEach(item => {
      col.push({
        title: `${item.name}`,
        dataIndex: item.tableField,
      });
    });
    col.forEach(item => {
      col1.push({
        ...item,
        title: `${item.title}2`,
        dataIndex: `${item.dataIndex}2`,
      });
    });
  }
  return col.concat(col1);
};

@connect(({ customReport, compareReport, list }) => ({
  compareReport,
  compareDataList: compareReport.compareDataList,
  firstReport: customReport.firstReport,
  dataCompare1: compareReport.dataCompare1,
  dataCompare2: compareReport.dataCompare2,
  compareReportTotal: customReport.compareReportTotal,
  directoryId: customReport.directoryId,
  navId: list.navId,
  hasPermiss: list.hasPermiss,
  userId: list.userId,
  compareData: compareReport.compareData,
  compareParam: customReport.compareParam,
  customFormulaData: compareReport.customFormulaData,
  formulaList: compareReport.formulaList,
  name: compareReport.name,
}))
@Form.create()
class CompareReportView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultReportId: '',
      visible: false,
      // reportDirId: 0,
      compareReportTotal: [],
      content: '',
      leftData1: {},
      header: [],
      dataCompare1: { pageNo: 1, pages: 0, records: [], searchCount: 0, size: 10, total: 0 },
      dataCompare2: { pageNo: 1, pages: 0, records: [], searchCount: 0, size: 10, total: 0 },
      // loading: false,
    };
  }

  componentDidMount = () => {
    const { compareReportTotal = [], dispatch } = this.props;
    dispatch({
      type: 'compareReport/clearAllData',
    });

    if (compareReportTotal.length !== 0) {
      this.getData(compareReportTotal[0].id);
      this.setState({
        defaultReportId: compareReportTotal[0].id,
        compareReportTotal,
      });
    }
  };

  componentWillReceiveProps = nextProps => {
    const {
      dataCompare1,
      dataCompare2,
      compareDataList = [],
      compareReport,
      formulaList = [],
    } = nextProps;
    const newData1 = dataCompare1 || this.state.dataCompare1;
    let newData2 = dataCompare2 || this.state.dataCompare2;
    const tableTh = columns(compareDataList);
    const rightData = [];
    const headerColumn = [];
    compareDataList.forEach(item => {
      headerColumn.push(item.tableField);
    });
    if (formulaList && formulaList.length !== 0) {
      formulaList.forEach(item => {
        rightData.push({
          getRightData: initExpression(compareReport, item.expression),
          name: item.name,
          format: item.type,
        });
        tableTh.push({
          title: (
            <Tooltip placement="topLeft" title="点击可编辑公式">
              <span onClick={this.showIndicatos.bind(this, item.id)} style={{ color: '#1890FF' }}>
                {item.name}
              </span>
            </Tooltip>
          ),
          dataIndex: item.name,
          id: item.id,
        });
      });
    }
    const arr = [];
    if (newData2.length !== 0) {
      // 右侧数据字段转化为字段2
      newData2.records.forEach(item => {
        const obj = Object.keys(item).reduce((newObj, key) => {
          newObj[`${key}2`] = item[key];
          return newObj;
        }, {});
        arr.push(obj);
      });
      newData2 = { ...newData2, records: arr };
    }
    // 结束

    // 数据合并开始
    let leftData1 = {};
    if (newData1.total > newData2.total) {
      leftData1 = newData1;
      leftData1.records.forEach((item, index) => {
        const data = newData2.records || [];
        const newObj = data[index] ? data[index] : {};
        item = Object.assign(item, newObj);
        if (rightData.length !== 0 && index < data.length) {
          rightData.forEach(opeation => {
            item[opeation.name] =
              index < data.length
                ? opeation.getRightData(index, {
                    format: opeation.format === 2 ? 'percent' : '',
                  })
                : '-';
          });
        }
      });
    } else {
      leftData1 = newData2;
      const TotalData = [];
      leftData1.records.forEach((item, index) => {
        const data = newData1.records || [];
        let newObj = {};
        if (!data[index]) {
          headerColumn.forEach(key => {
            newObj[key] = '-';
          });
        } else {
          newObj = data[index] ? data[index] : {};
        }
        if (rightData.length !== 0) {
          rightData.forEach(opeation => {
            item[opeation.name] =
              index < data.length
                ? opeation.getRightData(index, {
                    format: opeation.format === 2 ? 'percent' : '',
                  })
                : '-';
          });
        }
        TotalData.push({ ...newObj, ...item });
      });
      leftData1.records = TotalData;
    }
    // 结束
    return this.setState({
      leftData1,
      header: tableTh,
    });
  };

  showIndicatos = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compareReport/reportIndicatorsQuery',
      payload: { id },
    }).then(res => {
      this.setState(
        {
          visible: true,
          content: '自定义公式编辑',
        },
        () => {
          if (this.refs.compareIndicatorForm) {
            this.refs.compareIndicatorForm.setFieldsValue({
              name: res.name,
              formula: res.expression,
              format: res.type || 1,
            });
          }
        }
      );
    });
  };

  handleClickSearch = () => {
    // 查询
    const { defaultReportId } = this.state;
    this.getData(defaultReportId);
  };

  handleClickReset = () => {
    // 重置
    const { dispatch, compareParam } = this.props;
    const { defaultReportId } = this.state;
    const dataIndex = Object.keys(compareParam.datetime1);
    dispatch({
      type: 'customReport/saveCompareParam',
      payload: getNowTime(dataIndex),
    });
    this.getData(defaultReportId, 'reset');
  };

  handleClickDownload = () => {
    const { name } = this.props;
    const { header, leftData1 } = this.state;
    const option = {};
    const headerTitle = [];
    header.forEach(item => {
      if (typeof item.title === 'object') {
        headerTitle.push(item.dataIndex);
      } else {
        headerTitle.push(item.title);
      }
    });
    option.fileName = name;
    option.datas = [
      {
        sheetData: leftData1.records,
        sheetName: 'sheet',
        sheetHeader: headerTitle,
      },
    ];
    const toExcel = new ExportJsonExcel(option); // new
    toExcel.saveExcel();
  };

  // 获取table数据
  getData = (id, reset = '') => {
    const { dispatch, compareParam = {} } = this.props;
    let dataIndex = '';
    dispatch({
      type: 'compareReport/compareReportQuery',
      payload: { id, page: 'compare' },
    })
      .then(res => {
        const list = res.list || [];
        list.forEach(item => {
          if (item.selector === '时间选择') {
            dataIndex = item.tableField;
          }
        });
      })
      .then(() => {
        let compareParamDefault = {};
        if (!compareParam.datetime1 || reset === 'reset') {
          compareParamDefault = getNowTime(dataIndex);
        } else {
          compareParamDefault = compareParam;
        }
        dispatch({
          type: 'compareReport/compareReportQueryData',
          payload: {
            ...compareParamDefault.datetime1,
            id,
            page: 'compare',
            pageSize: 10000,
          },
        });
        dispatch({
          type: 'compareReport/compareReportQueryData',
          payload: {
            ...compareParamDefault.datetime2,
            id,
            pageSize: 10000,
          },
        });
      })
      .then(() => {
        dispatch({
          type: 'compareReport/reportIndicatorsList',
          payload: { id },
        });
      });
  };

  // 退出对比
  leaveComparePage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customReport/changeCompareView',
      payload: { flag: false },
    });
  };

  tabChange = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compareReport/clearAllData',
    });
    this.getData(key);
    this.setState({
      defaultReportId: key,
    });
  };

  onClose = () => {
    const $this = this;
    confirm({
      title: '注意退出将取消本次编辑',
      content: '确定继续吗？',
      okText: '继续退出',
      cancelText: '取消',
      onOk() {
        $this.setState({
          visible: false,
        });
      },
    });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compareReport/compareInfo',
      payload: { reportPeriodCompare: {} },
    });
    this.setState(
      {
        visible: true,
        content: '同期对比编辑',
      },
      () => {
        this.refs.compareReportFormValue.setFieldsValue({
          name: '',
        });
      }
    );
  };

  remove = targetKey => {
    const $this = this;
    const { dispatch, navId } = this.props;
    const { compareReportTotal } = this.state;
    confirm({
      title: '即将彻底删除该报表',
      content: '确定要继续么',
      okText: '继续删除',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'compareReport/deleteCompareReport',
          payload: { id: targetKey, type: navId === 0 ? 'offical' : '' },
        });
        if (compareReportTotal.length === 1) {
          dispatch({
            type: 'compareReport/clearAllData',
          });
          dispatch({
            type: 'customReport/changeCompareView',
            payload: { flag: false },
          });
          return null;
        }
        compareReportTotal.forEach((item, index) => {
          if (item.id === Number(targetKey)) {
            compareReportTotal.splice(index, 1);
          }
        });
        dispatch({
          type: 'customReport/saveDirectory',
          payload: compareReportTotal,
        });
        $this.getData(compareReportTotal[0].id);
        $this.setState({
          compareReportTotal,
          defaultReportId: compareReportTotal[0].id,
        });
        return null;
      },
    });
  };

  onSubmit = () => {
    const { content } = this.state;
    if (content === '同期对比编辑') {
      this.compareDataSubmit();
    } else {
      this.indicatorsDataSubmit();
    }
  };

  compareDataSubmit = () => {
    const {
      dispatch,
      compareData = {},
      location: { query },
      directoryId,
      compareReportTotal = [],
      navId,
    } = this.props;
    const formEdit = this.refs.compareReportFormValue;
    const indicatorsIdsData = compareData.indicatorsId || '[]';
    formEdit.validateFields((err, values) => {
      if (JSON.parse(indicatorsIdsData).length <= 1) {
        notification.error({
          message: '请选择指标',
        });
        return;
      }
      if (JSON.parse(indicatorsIdsData).length > 5) {
        notification.error({
          message: '只能选择5个指标',
        });
        return;
      }

      if (!err) {
        const newValue = {
          name: values.name,
          indicatorsIds: indicatorsIdsData,
          id: compareData.id ? compareData.id : '',
          parentId: query.key || directoryId,
          page: 'compare',
          type: navId === 0 ? 'offical' : '',
        };
        dispatch({
          type: 'compareReport/compareReportSave',
          payload: newValue,
        }).then(res => {
          if (!compareData.id) {
            compareReportTotal.push({ id: res, name: values.name });
            dispatch({
              type: 'customReport/saveDirectory',
              payload: compareReportTotal,
            });
          } else {
            compareReportTotal.forEach((item, index) => {
              if (item.id === res) {
                compareReportTotal[index].name = values.name;
              }
            });
          }
          this.getData(res);
          this.setState({
            defaultReportId: res,
            visible: false,
          });
        });
      }
    });
  };

  indicatorsDataSubmit = () => {
    const formEdit = this.refs.compareIndicatorForm;
    formEdit.validateFields((err, values) => {
      if (!err) {
        const { name, formula, format } = values;
        const {
          firstReport: { id },
          dispatch,
          formulaList = [],
          customFormulaData,
        } = this.props;
        const { defaultReportId } = this.state;
        dispatch({
          type: 'compareReport/reportSaveDefinedIndicators',
          payload: {
            expression: formula,
            name,
            type: format,
            reportId: id,
            reportPeriodCompareId: defaultReportId,
            id: customFormulaData.id ? customFormulaData.id : '',
          },
        }).then(res => {
          if (customFormulaData.id) {
            formulaList.forEach(item => {
              if (item.id === customFormulaData.id) {
                item.name = name;
                item.expression = formula;
                item.type = format;
              }
            });
          } else {
            formulaList.push({
              expression: formula,
              name,
              type: format,
              reportId: id,
              reportPeriodCompareId: defaultReportId,
              id: res,
            });
          }
          dispatch({
            type: 'compareReport/formulaList',
            payload: formulaList,
          });
          this.setState({
            visible: false,
          });
        });
      }
    });
  };

  editCompareReport = () => {
    const { dispatch } = this.props;
    const { defaultReportId } = this.state;
    dispatch({
      type: 'compareReport/compareReportDetail',
      payload: { id: defaultReportId },
      callback: data => {
        this.setState(
          {
            visible: true,
            content: '同期对比编辑',
          },
          () => {
            this.refs.compareReportFormValue.setFieldsValue({
              name: data.name,
            });
          }
        );
      },
    });
  };

  showCompare = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compareReport/updateCustomFormulaData',
      payload: {},
    });
    this.setState(
      {
        visible: true,
        content: '自定义公式编辑',
      },
      () => {
        this.refs.compareIndicatorForm.setFieldsValue({
          name: '',
          formula: '',
          format: 1, // 默认数字
        });
      }
    );
  };

  // tab
  renderTab = () => {
    const { defaultReportId, compareReportTotal } = this.state;
    const { navId, userId, hasPermiss } = this.props;
    const tabArr = [];
    compareReportTotal.forEach(item => {
      tabArr.push(<TabPane tab={item.name} key={item.id} />);
    });
    return (
      <Tabs
        onChange={this.tabChange}
        type={(navId === 0 && hasPermiss) || userId === 0 ? 'editable-card' : 'card'}
        activeKey={`${defaultReportId}`}
        onEdit={this.onEdit}
      >
        {tabArr}
      </Tabs>
    );
  };

  // 查询内容
  renderSelect() {
    const { compareDataList = [] } = this.props;
    const ListObj = {};
    compareDataList.forEach(col => {
      const { selector } = col;
      if (selector) {
        if (ListObj[selector]) {
          ListObj[selector].push(col);
        } else {
          ListObj[selector] = [selector, col];
        }
      }
    });
    const ColList = [];
    if (ListObj['时间选择']) {
      ListObj['时间选择'].forEach((li, j) => {
        if (j === 0) {
          ColList.push();
        } else {
          ColList.push(
            <Col className="m-bottom-16 m-right-32" key={li.id}>
              <SelectRangePicker
                // dataIndex={ListObj['时间选择'].length > 1 ? 'paytime' : li.tableField}
                dataIndex={li.tableField}
              />
            </Col>
          );
        }
      });
    }
    return (
      <div>
        <Row type="flex" justify="start" align="middle">
          {ColList}
        </Row>
        <Row className="p-top-16" type="flex">
          <Col className="m-bottom-16" style={{ flex: '1 0 auto' }}>
            <Button className="float-r" onClick={this.handleClickReset}>
              重置
            </Button>
            <Button type="primary" className="m-right-8 float-r" onClick={this.handleClickSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { loading, firstReport, navId, userId, hasPermiss } = this.props;
    const { visible, content, header, leftData1 } = this.state;
    const headerArr = [];
    if (header.length > 0) {
      header.forEach(item => {
        headerArr.push({
          ...item,
          // width: `${100 / header.length}%`,
          render: text => (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}>
              {text}
            </div>
          ),
        });
      });
    }
    return (
      <PageHeaderWrapper
        title={firstReport.name}
        action={[
          <span key="comOpe">
            <Button onClick={this.leaveComparePage}>退出对比</Button>
          </span>,
        ]}
        style={{ width: '100%' }}
      >
        <div className="container m-top-8">{this.renderSelect.call(this)}</div>
        <div className="container m-top-8" style={{ paddingBottom: '30px' }}>
          <Row type="flex" justify="space-between" align="middle">
            <Col className="m-bottom-16">
              共检索到 {leftData1.total ? leftData1.total : 0} 条数据
            </Col>
            <Col className="m-bottom-16">
              <Button icon="download" onClick={this.handleClickDownload}>
                下载
              </Button>
            </Col>
          </Row>
          {this.renderTab()}
          {(navId === 0 && hasPermiss) || userId === 0 ? (
            <Row align="middle">
              <Col className="m-bottom-16" span={18}>
                <Button type="primary" onClick={this.editCompareReport}>
                  编辑对比信息
                </Button>
              </Col>
              <Col className="m-bottom-16" span={6} style={{ textAlign: 'right' }}>
                <Button onClick={this.showCompare}>添加对比指标</Button>
              </Col>
            </Row>
          ) : null}
          <Row type="flex" justify="space-between" align="middle">
            <Col span={24}>
              <Table
                dataSource={
                  leftData1 && leftData1.records
                    ? leftData1.records.map((item, index) => ({
                        ...item,
                        key: index,
                      }))
                    : []
                }
                columns={headerArr}
                onChange={this.dataChange}
                loading={loading}
                pagination={{
                  total: leftData1.total || 0,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '500', '1000', '5000'],
                  onShowSizeChange: true,
                  showQuickJumper: true,
                }}
              />
            </Col>
          </Row>

          <Drawer title={content} width={720} onClose={this.onClose} visible={visible}>
            {content === '同期对比编辑' ? (
              <DataWrapperForm ref="compareReportFormValue" />
            ) : (
              <CompareIndicatorForm ref="compareIndicatorForm" />
            )}
            <div
              style={{
                width: '100%',
                marginTop: '30px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onSubmit} type="primary">
                保存
              </Button>
            </div>
          </Drawer>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CompareReportView;
