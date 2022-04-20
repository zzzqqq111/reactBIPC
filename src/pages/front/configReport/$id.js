import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Table,
  Button,
  Drawer,
  Modal,
  message,
  notification,
  Tooltip,
  Checkbox,
  Dropdown,
} from 'antd';
import ReactDragListView from 'react-drag-listview';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditReportForm from './settingReport';
import MenuLeft from './MenuLeft';
import { formatTime } from '@/utils/timeFormat';
import FilterHeader from '../components/filterHeader';
import { isAdmin, isAdmin2 } from '@/utils/role';
import ShareContent from './share';

const { confirm } = Modal;

const PAGINATION_DEFAULT = {
  'current': 1,
  'total': 0,
  'showSizeChanger': true,
  'pageSizeOptions': ['10', '500', '1000', '5000'],
  'showQuickJumper': true,
  'pageSize': 10,
};

@connect(({ report, menuLeft, list, loading }) => ({
  data: report.data,
  report: report.report,
  reportMessage: report.reportMessage,
  show: report.show,
  defaultValue: menuLeft.defaultValue,
  navId: list.navId,
  reportInfo: report.reportInfo,
  listLoading: loading.effects['report/customReportQueryData'],
  paramsTransaction: report.paramsTransaction,
}))



class ConfigReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      shareVisible: false,
      columns: [],
      titleFilter: [],
      selectOption: [],
      dropdownVisible: false,
      download: false,

      pagination:PAGINATION_DEFAULT,
      filters:{},
      sorter:{}
    };
  }

  componentDidMount = () => {
    const {
      location: { query },
    } = this.props;
    if (query.key) {
      this.queryData(query.key);
    }
    const bodyNode = document.querySelector('#body');
    bodyNode.addEventListener('mouseup', this.hideDropdown, false);
    isAdmin2().then(res => {
      this.setState({
        download: res,
      });
    });
  };

  onDragEnd = (fromIndex, toIndex) => {
    const { columns } = this.state;
    const item = columns.splice(fromIndex, 1)[0];
    columns.splice(toIndex, 0, item);
    this.setState({
      columns,
    });
  };

  queryData = id => {
    const { dispatch, navId } = this.props;
    dispatch({
      type: 'report/customReportQuery',
      payload: { id, type: navId === 1 ? '' : 'offical' },
    }).then(res => {
      if (res && res.indicators && res.indicators.length !== 0) {
        console.log('queryData:', id);
        this.fetchData()
      }
    });
  };

  componentWillReceiveProps = nextProps => {
    const {
      defaultValue,
      location: { query },
      report = [],
    } = nextProps;
    const {
      defaultValue: { defaultSelectedKeys },
    } = this.props;
    const arr = [];
    const arr1 = [];
    if (
      (defaultSelectedKeys[0] &&
        defaultValue.defaultSelectedKeys[0] &&
        defaultValue.defaultSelectedKeys[0] !== defaultSelectedKeys[0] &&
        !query.key) ||
      (!defaultSelectedKeys[0] && defaultValue.defaultSelectedKeys[0] && !query.key)
    ) {
      this.queryData(defaultValue.defaultSelectedKeys[0]);
    }
    if (report.length !== 0) {
      report.forEach(item => {
        arr.push({ label: item.name, value: item.field });
        arr1.push({
          title: (
            <Tooltip placement="topLeft" title={item.define}>
              {item.name}
            </Tooltip>
          ),
          dataIndex: item.field,
          key: item.field,
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          render: text => (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}>
              {item.type.toLowerCase() === 'datetime' ||
              item.type.toLowerCase() === 'date' ||
              item.type.toLowerCase() === 'timestamp'
                ? formatTime(text)
                : text}
            </div>
          ),
        });
      });
      this.setState({
        columns: arr1,
        titleFilter: arr,
        selectOption: arr1,
      });
    }
  };

  componentWillUnmount = () => {
    const bodyNode = document.querySelector('#body');
    bodyNode.addEventListener('mouseup', this.hideDropdown, false);
  };

  showEditPage = id => {
    const { dispatch, navId } = this.props;
    dispatch({
      type: 'report/reportDetail',
      payload: { id, type: navId === 1 ? '' : 'offical' },
      callback: res => {
        this.show();
        if (this.refs.editReportForm) {
          let dataSource1 = '';
          if (res.dataSource) {
            // 如果有数据库  获取维度和指标
            dataSource1 = res.dataSource.split('.');
            dispatch({
              type: 'report/fetchTypeList',
              payload: {
                databaseName: dataSource1[0],
                tableName: dataSource1[1],
              },
            });
          }
          this.refs.editReportForm.setFieldsValue({
            dimensions: JSON.parse(res.dimensions) || [],
            dataSource: [`${res.channelName}`, `${res.dataSource}`],
            name: res.name,
            number: res.number,
          });
        }
      },
    });
  };

  show = () => {
    this.setState({
      visible: true,
    });
  };

  resetField = () => {
    // 重新设置编辑页面所有内容为空
    this.refs.editReportForm.setFieldsValue({
      dimensions: [],
      dataSource: '',
      name: '',
      number: '',
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

  onSubmit = () => {
    const { dispatch, reportInfo, navId, reportMessage = {} } = this.props;
    const { indicatorIds = [], number } = reportInfo;
    const formEdit = this.refs.editReportForm;
    if (indicatorIds.length !== 0) {
      indicatorIds.forEach(item => {
        if (typeof item.id === 'number') {
          item.id = `${item.id}`;
        }
      });
    } else {
      notification.error({
        message: '请选择指标',
      });
      return;
    }

    formEdit.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'report/customReportSave',
          payload: {
            ...values,
            indicators: JSON.stringify(indicatorIds) || '[]',
            id: number ? reportMessage.id : '',
            dimensions: JSON.stringify(values.dimensions) || '[]',
            dataSource: `${values.dataSource[1]}`,
            directoryId: reportMessage.directoryId,
            public: navId === 1 ? '' : 'offical',
          },
        }).then(res => {
          dispatch({
            type: 'menuLeft/directoryQuery',
            payload: { id: navId, public: navId === 1 ? '' : 'offical' },
          });
          this.queryData(res);
          router.push(`/front/configReport/${navId}?key=${res}`);
          this.setState({
            visible: false,
          });
          message.success('保存成功');
          dispatch({
            type: 'report/resetReportInfo',
          });
        });
      }
    });
  };

  handleClickDownload = () => {
    // 下载
    const { dispatch, reportMessage, paramsTransaction = {} } = this.props;
    dispatch({
      type: 'report/download',
      payload: {
        reportId: reportMessage.id,
        ...paramsTransaction,
      },
    });
    dispatch({
      type: 'report/saveDownload',
      payload: {
        name: `${reportMessage.id}_${reportMessage.name}`,
      },
    });
  };

  // 数据分页和排序
  dataChange = (pagination, filters, sorter) => {
    console.log('dataChange:',pagination,filters,sorter);

    this.setState({
      pagination,
      filters,
      sorter,
    },()=>{
      this.fetchData()
    });

  }


  fetchData = ()=>{

    const { paramsTransaction, dispatch, reportMessage, navId } = this.props;
    const { pagination, filters, sorter } = this.state;

    let sortInfo={}

    if(sorter.field){
      sortInfo={
        orderBy: sorter.field,
        sort:sorter.order === 'descend'?'desc':'asc',
      }
    }

    dispatch({
      type: 'report/customReportQueryData',
      payload: {
        ...paramsTransaction,
        ...sortInfo,
        reportId: reportMessage.id,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        type: navId === 1 ? '' : 'offical',
      },
    });
  }

  handleClickSearch=()=>{
    this.setState({
      pagination: {
        ...this.state.pagination,
        current:1
      },
    },()=>{
      this.fetchData()
    });
  }
  handleClickReset = () => {
    // 重置
    const { dispatch} = this.props;
    dispatch({
      type: 'report/resetParam',
    });
    this.setState({
      pagination: {...PAGINATION_DEFAULT},
      sorter:{},
      filters:{},
    },()=>{
      this.fetchData()
    });
  };

  // 共享
  showShareModal = () => {
    const { dispatch, reportMessage } = this.props;
    dispatch({
      type: 'report/fetchUserList',
      payload: { pageSize: 10000 },
    });
    dispatch({
      type: 'report/getUsersByReportId',
      payload: { id: reportMessage.id },
    }).then(() => {
      this.setState({
        shareVisible: true,
      });
    });
  };

  handleCancelVisible = () => {
    this.setState({
      shareVisible: false,
    });
  };

  onChange = () => checkedValues => {
    const { selectOption } = this.state;
    const data = [];
    selectOption.forEach(r => {
      checkedValues.forEach(rs => {
        if (r.key === rs) {
          data.push(r);
        }
      });
    });
    this.setState({ columns: data });
  };

  showDropdown = () => {
    const { dropdownVisible } = this.state;
    this.setState({
      dropdownVisible: !dropdownVisible,
    });
  };

  hideDropdown = () => {
    this.setState({
      dropdownVisible: false,
    });
  };

  render() {
    const {
      report = [],
      data,
      reportMessage = {},
      dispatch,
      listLoading,
      paramsTransaction,
      navId,
    } = this.props;
    const {
      visible,
      current,
      shareVisible,
      columns,
      titleFilter,
      dropdownVisible,
      download,
    } = this.state;
    const arr = [];
    titleFilter.forEach(item => {
      arr.push(item.value);
    });
    return (
      <Fragment>
        <MenuLeft showEdit={this.show} queryData={this.queryData} resetField={this.resetField}>
          {reportMessage.name || visible ? (
            <PageHeaderWrapper
              title={reportMessage.name}
              key={reportMessage.name}
              action={[
                <span key="ope">
                  <Button
                    type="primary"
                    onClick={() => {
                      this.showEditPage(reportMessage.id);
                    }}
                  >
                    编辑
                  </Button>
                  {isAdmin() && navId !== 1 ? (
                    <Button onClick={this.showShareModal}>共享</Button>
                  ) : null}
                </span>,
              ]}
              style={{ width: '100%' }}
              id="body"
            >
              <div style={{ height: '8px', background: '#f0f2f5' }} />
              <FilterHeader
                report={report}
                handleClickSearch={this.handleClickSearch}
                handleClickReset={this.handleClickReset}
                saveRoute="report/changeParam"
                paramsTransaction={paramsTransaction}
                listData="report/selectIndicatorData"
              />
              <div className="container m-top-8">
                <Row type="flex" justify="space-between" align="middle">
                  <Col className="m-bottom-16">
                    共检索到 {report.length === 0 ? 0 : data.total} 条数据
                  </Col>
                  <Col className="m-bottom-16">
                    <Dropdown
                      overlay={
                        <Checkbox.Group
                          // options={titleFilter}
                          onChange={this.onChange()}
                          style={{
                            background: '#fff',
                            width: 150,
                            padding: 10,
                            boxShadow: '0 0 5px 2px rgba(0,0,0,0.1)',
                          }}
                          defaultValue={arr}
                        >
                          {titleFilter.map(item => (
                            <Checkbox value={item.value} style={{ marginLeft: 0 }} key={item.value}>
                              {item.label}
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                      }
                      trigger={['click']}
                      onClick={this.showDropdown}
                      visible={dropdownVisible}
                    >
                      <Button icon="filter">选择字段</Button>
                    </Dropdown>
                    {download ? (
                      <Button
                        icon="download"
                        onClick={this.handleClickDownload}
                        style={{ marginLeft: '15px' }}
                      >
                        下载
                      </Button>
                    ) : null}
                  </Col>
                </Row>
                <ReactDragListView.DragColumn nodeSelector="th" onDragEnd={this.onDragEnd}>
                  <Table
                    dataSource={data.records.map((item, index) => ({
                      ...item,
                      key: index,
                    }))}
                    columns={columns}
                    pagination={{
                      ...this.state.pagination,
                      total: data.total || 0,
                    }}
                    onChange={this.dataChange}
                    loading={listLoading}
                  />
                </ReactDragListView.DragColumn>
              </div>
              <Drawer title="编辑报表" width={800} onClose={this.onClose} visible={visible}>
                <EditReportForm ref="editReportForm" />
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
              <ShareContent
                ref="share"
                visible={shareVisible}
                handleCancelVisible={this.handleCancelVisible}
                {...this.props}
                id={reportMessage.id}
              />
            </PageHeaderWrapper>
          ) : null}
        </MenuLeft>
      </Fragment>
    );
  }
}
export default ConfigReport;
