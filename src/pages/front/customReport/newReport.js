/* eslint-disable no-param-reassign */
/* eslint-disable react/no-string-refs */
/**
 * 自定义报表
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Form, Select, Drawer, Modal, Tooltip, notification } from 'antd';
import SelectCascader from './components/SelectCascader';
import SelectDefault from './components/SelectDefault';
import SelectRangePicker from './components/SelectRangePicker';
import SelectSearch from './components/SelectSearch';
import WrapperForm from './editReport';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../components/style.less';
import DataWrapperForm from './compareReport/dataCompareEdit';
import { formatTime } from '@/utils/timeFormat';
import ShareContent from './share/index';

const { confirm } = Modal;
@connect(({ customReport, list }) => ({
  report: customReport.report,
  paramsTransaction: customReport.paramsTransaction,
  firstReport: customReport.firstReport,
  data: customReport.data,
  menuList: customReport.menuList,
  compareData: customReport.compareData,
  directoryId: customReport.directoryId,
  defaultValue: customReport.defaultValue,
  show: customReport.show,
  userId: list.userId,
  navId: list.navId,
  hasPermiss: list.hasPermiss,
}))
@Form.create()
class NewReportView extends React.Component {
  constructor(props) {
    super(props);
    const { show } = this.props;
    this.state = {
      visible: show,
      editContent: '',
      shareVisible: false,
      current: 1,
      fetchSelectIndicatorData: false,
      selectIndicatorData: {},
    };
  }

  componentWillReceiveProps = nextProps => {
    const { show } = nextProps;
    this.setState({
      visible: show,
    });
  };

  handleClickSearch = () => {
    // 查询
    const { dispatch, paramsTransaction, firstReport, navId } = this.props;
    dispatch({
      type: 'customReport/customReportQueryData',
      payload: {
        ...paramsTransaction,
        reportId: firstReport.id,
        type: navId === 0 ? 'offical' : '',
      },
    });
  };

  handleClickReset = () => {
    // 重置
    const { dispatch, firstReport, navId } = this.props;
    dispatch({
      type: 'customReport/resetParam',
    });
    dispatch({
      type: 'customReport/customReportQueryData',
      payload: {
        reportId: firstReport.id,
        type: navId === 0 ? 'offical' : '',
      },
    });
    this.setState({
      current: 1,
    });
  };

  switchSelect = title => {
    // 选择器
    switch (title) {
      case '下拉框选择':
        return SelectDefault;
      case '输入框':
        return SelectSearch;
      case '时间选择':
        return SelectRangePicker;
      case '地区选择':
        return SelectCascader;
      default:
        return null;
    }
  };

  showDrawer = content => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customReport/isShow',
      payload: true,
    });
    this.setState({
      editContent: content,
    });
  };

  getInfo = () => {
    const { dispatch, firstReport, navId } = this.props;
    // 编辑时获取指标
    dispatch({
      type: 'customReport/reportDetail',
      payload: { id: firstReport.id, type: navId === 0 ? 'offical' : '' },
    });
    setTimeout(() => {
      dispatch({
        type: 'customReport/saveFirstReportData',
        payload: { ...firstReport, edit: true },
      });
      dispatch({
        type: 'customReport/isShow',
        payload: true,
      });
    }, 100);
  };

  onClose = () => {
    const { dispatch, firstReport } = this.props;
    confirm({
      title: '注意退出将取消本次编辑',
      content: '确定继续吗？',
      okText: '继续退出',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'customReport/saveFirstReportData',
          payload: { ...firstReport },
        });
        dispatch({
          type: 'customReport/isShow',
          payload: false,
        });
      },
    });
  };

  // reportDelete = id => {
  //   const { dispatch } = this.props;
  //   confirm({
  //     title: '即将彻底删除该报表',
  //     content: '确定要继续么',
  //     okText: '继续删除',
  //     okType: 'primary',
  //     cancelText: '取消',
  //     onOk() {
  //       dispatch({
  //         type: 'customReport/deleteReport',
  //         payload: { id },
  //         callback: () => {
  //           dispatch({
  //             type: 'customReport/directoryQuery',
  //           });
  //           dispatch({
  //             type: 'customReport/resetAllParam',
  //           });
  //           router.push(`/front/customReport`);
  //         },
  //       });
  //     },
  //   });
  // };

  handleClickDownload = () => {
    // 下载
    const { dispatch, paramsTransaction, firstReport, navId } = this.props;
    dispatch({
      type: 'customReport/download',
      payload: {
        ...paramsTransaction,
        reportId: firstReport.id,
        type: Number(navId) === 0 ? 'offical' : '',
      },
    });
    dispatch({
      type: 'customReport/saveDownload',
      payload: {
        name: `${firstReport.id}_${firstReport.name}`,
      },
    });
  };

  dataChange = (pagination, filters, sorter) => {
    const { paramsTransaction, dispatch, firstReport, navId } = this.props;
    let sort = '';
    if (sorter.order === 'descend') {
      sort = 'desc';
    }
    if (sorter.order === 'ascend') {
      sort = 'asc';
    }
    this.setState({
      current: pagination.current,
    });
    dispatch({
      type: 'customReport/customReportQueryData',
      payload: {
        ...paramsTransaction,
        orderBy: sorter.field,
        sort,
        reportId: firstReport.id,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        type: navId === 0 ? 'offical' : '',
      },
    });
  };

  // 保存数据
  onSubmit = () => {
    const { editContent } = this.state;
    if (editContent === 'compareReport') {
      // 同期对比编辑数据
      this.saveCompareReportData();
    } else {
      // 报表编辑数据
      this.saveReportData();
    }
  };

  saveReportData = () => {
    const { dispatch, firstReport = {}, navId } = this.props;
    const { customReport = {} } = firstReport;
    const formEdit = this.refs.getFormValue;
    let indicatorsIdsData = '[]';
    formEdit.validateFields((err, values) => {
      indicatorsIdsData = customReport.indicatorsIds;
      const newValue = {
        ...values,
        indicatorsIds: indicatorsIdsData || '[]',
        // parentId: values.parentId[1],
        id: firstReport.id ? firstReport.id : '',
        indictorId: '',
        type: navId === 0 ? 'offical' : '',
      };
      if (!err) {
        dispatch({
          type: 'customReport/customReportSave',
          payload: newValue,
        }).then(res => {
          dispatch({
            type: 'customReport/saveFirstReportData',
            payload: { ...newValue, id: res },
          });
          dispatch({
            type: 'customReport/isShow',
            payload: false,
          });
          dispatch({
            type: 'customReport/customReportQuery',
            payload: { id: res, type: navId === 0 ? 'offical' : '' },
          });
          if (indicatorsIdsData && indicatorsIdsData !== '[]') {
            dispatch({
              type: 'customReport/customReportQueryData',
              payload: {
                reportId: firstReport.id,
                type: navId === 0 ? 'offical' : '',
              },
            });
          }
          dispatch({
            type: 'customReport/directoryQuery',
            payload: { id: navId, type: Number(navId) === 0 ? 'offical' : '' },
          });
        });
      }
    });
  };

  saveCompareReportData = () => {
    const {
      dispatch,
      location: { query },
      directoryId,
      navId,
    } = this.props;
    const formEdit = this.refs.compareReportFormValue;
    formEdit.validateFields((err, values) => {
      const newValue = {
        name: values.name,
        indicatorsIds: values.indicatorsIds ? JSON.stringify(values.indicatorsIds) : [],
        parentId: query.key || directoryId,
        type: navId === 0 ? 'offical' : '',
      };
      dispatch({
        type: 'customReport/dataCompareReportSave',
        payload: { ...newValue },
      }).then(res => {
        dispatch({
          type: 'customReport/saveDirectory',
          payload: [{ id: res, name: values.name, type: navId === 0 ? 'offical' : '' }],
        });
        dispatch({
          type: 'customReport/isShow',
          payload: false,
        });
        dispatch({
          type: 'customReport/changeCompareView',
          payload: { flag: true },
        });
      });
    });
  };

  goComparePage = () => {
    const {
      dispatch,
      directoryId,
      location: { query },
      navId,
      userId,
      hasPermiss,
    } = this.props;
    dispatch({
      type: 'customReport/reportQueryList',
      payload: { id: query.key || directoryId, change: true },
    }).then(res => {
      if (res.length === 0) {
        if ((navId === 0 && hasPermiss) || userId === 0) {
          this.showDrawer('compareReport');
        }
      } else {
        dispatch({
          type: 'customReport/saveDirectory',
          payload: res,
        });
        dispatch({
          type: 'customReport/changeCompareView',
          payload: { flag: true },
        });
      }
    });
  };

  showShareModal = () => {
    const { dispatch, firstReport, report } = this.props;
    if (report && report.length === 0) {
      notification.error({
        message: '暂无指标，无法共享',
      });
      return;
    }
    dispatch({
      type: 'customReport/fetchUserList',
      payload: { pageSize: 10000 },
    });
    dispatch({
      type: 'customReport/getUsersByReportId',
      payload: { pageSize: 10000, reportId: firstReport.id },
    });
    this.setState({
      shareVisible: true,
    });
  };

  handleCancelVisible = () => {
    this.setState({
      shareVisible: false,
    });
  };

  renderSelect() {
    const { report, dispatch } = this.props;
    // @todo 不好的写法，着急回家，以后再改
    const { selectIndicatorData, fetchSelectIndicatorData } = this.state;
    const RowList = [];
    const ListObj = {};
    if (report.length === 0) {
      return (
        <Row type="flex" justify="start" align="middle">
          <Col className="m-bottom-16 m-right-24">自定义选择器：</Col>
          <Col className="m-bottom-16 m-right-24">
            <Select style={{ width: 200 }} placeholder="请选择" />
          </Col>
        </Row>
      );
    }

    report.forEach(col => {
      if (col.selector === '下拉框选择') {
        col.selectorList = [];
        // 还没获取过数据的时候获取一次
        if (!fetchSelectIndicatorData) {
          this.setState({
            fetchSelectIndicatorData: true,
          });
          dispatch({
            type: 'customReport/selectIndicatorData',
            payload: { id: col.id },
          }).then(res => {
            // col.selectorList = res || [];
            if (!res) return;
            const arr = [];
            res.forEach(item => {
              arr.push(item.name);
            });
            selectIndicatorData[col.id] = arr;
            this.setState({
              selectIndicatorData,
            });
          });
        }
        col.selectorList = selectIndicatorData[col.id] || [];
      }
      const { selector } = col;
      if (selector) {
        if (ListObj[selector]) {
          ListObj[selector].push(col);
        } else {
          ListObj[selector] = [selector, col];
        }
      }
    });

    ['时间选择', '地区选择', '下拉框选择', '输入框'].forEach((key, i, arr) => {
      if (ListObj[key]) {
        const ColList = [];
        ListObj[key].forEach((li, j) => {
          if (j === 0) {
            ColList.push(
              <Col className="m-bottom-16 m-right-32" key={li}>
                {li}：
              </Col>
            );
          } else {
            const SelectCol = this.switchSelect(li.selector);

            ColList.push(
              <Col className="m-bottom-16 m-right-32" key={li.id}>
                <SelectCol
                  ref={ref => {
                    this[`${li.dataIndex}`] = ref;
                  }}
                  placeholder={li.name}
                  dataIndex={li.tableField}
                  options={li.selectorList || []}
                />
              </Col>
            );
          }
        });

        switch (i) {
          case 0:
            RowList.push(
              <Row type="flex" justify="start" align="middle" key={key}>
                {ColList}
              </Row>
            );
            break;
          case arr.length - 1:
            RowList.push(
              <Row className="p-top-16" type="flex" justify="start" align="middle" key={key}>
                {ColList}
              </Row>
            );
            break;
          default:
            RowList.push(
              <Row className="p-top-16" type="flex" justify="start" align="middle" key={key}>
                {ColList}
              </Row>
            );
            break;
        }
      }
    });

    return (
      <div>
        {RowList}
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
    const {
      loading,
      report,
      firstReport,
      data,
      // defaultValue = {},
      navId,
      userId,
      hasPermiss,
      paramsTransaction,
      dispatch,
    } = this.props;
    const { editContent, shareVisible, visible, current } = this.state;
    if (!firstReport.name) {
      return null;
    }
    const columns = () => {
      const col = [];
      if (report) {
        report.map(item => {
          col.push({
            title: (
              <Tooltip placement="topLeft" title={item.define}>
                {item.name}
              </Tooltip>
            ),
            dataIndex: item.tableField,
            key: item.id,
            sortDirections: ['descend', 'ascend'],
            sorter: true,
            render: text => (
              <div
                style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
              >
                {item.selector === '时间选择' ? formatTime(text) : text}
              </div>
            ),
          });
          return col;
        });
      }
      return col;
    };
    let editDom = null;
    let title = '';
    let content = '';
    if (editContent === 'compareReport') {
      title = '同期数据对比';
      content = <DataWrapperForm ref="compareReportFormValue" />;
    } else {
      title = '编辑报表';
      content = <WrapperForm ref="getFormValue" />;
    }

    if (firstReport.id) {
      editDom = (
        <Drawer title={title} width={720} onClose={this.onClose} visible={visible}>
          {content}
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
      );
    }
    const fielterItem = report.filter(item => {
      return item.selector === '时间选择';
    });

    return (
      <PageHeaderWrapper
        title={firstReport.name}
        key={firstReport.name}
        action={[
          <span key="ope">
            {fielterItem && fielterItem.length !== 0 ? (
              <Button
                onClick={() => {
                  this.goComparePage();
                }}
              >
                同期对比
              </Button>
            ) : null}
            {(navId === 0 && hasPermiss) || userId === 0 ? (
              <Button
                type="primary"
                onClick={() => {
                  this.getInfo();
                  this.showDrawer('editReport');
                }}
              >
                编辑
              </Button>
            ) : null}
            {userId === 0 && navId !== 0 ? (
              <Button onClick={this.showShareModal}>共享</Button>
            ) : null}
            {/* <Button
                onClick={() => {
                  this.reportDelete(firstReport.id);
                }}
              >
                删除
              </Button> */}
          </span>,
        ]}
        style={{ width: '100%' }}
      >
        <div className="container m-top-8">{this.renderSelect.call(this)}</div>
        <div className="container m-top-8">
          <Row type="flex" justify="space-between" align="middle">
            <Col className="m-bottom-16">
              共检索到 {report.length === 0 ? 0 : data.total} 条数据
            </Col>
            <Col className="m-bottom-16">
              <Button icon="download" onClick={this.handleClickDownload}>
                下载
              </Button>
            </Col>
          </Row>
          <Table
            dataSource={report.length === 0 ? [] : data.records}
            columns={columns()}
            rowKey={record => record.id}
            pagination={
              report.length === 0
                ? false
                : {
                    onShowSizeChange: (nowPage, pageSize) => {
                      dispatch({
                        type: 'indicator/fetchList',
                        payload: {
                          pageNo: nowPage,
                          pageSize,
                          id: firstReport.id,
                          type: navId === 0 ? 'offical' : '',
                          ...paramsTransaction.payload,
                        },
                      });
                    },
                    current,
                    total: data.total || 0,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '500', '1000', '5000'],
                    showQuickJumper: true,
                  }
            }
            onChange={this.dataChange}
            loading={loading}
            rowClassName={() => styles.tableTd}
          />
        </div>
        {editDom}
        <ShareContent
          ref="share"
          visible={shareVisible}
          handleCancelVisible={this.handleCancelVisible}
          {...this.props}
        />
      </PageHeaderWrapper>
    );
  }
}

export default NewReportView;
