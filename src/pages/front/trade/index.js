/**
 * name: trade
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button } from 'antd';
import SelectCascader from '../components/SelectCascader';
import SelectDefault from '../components/SelectDefault';
import SelectRangePicker from '../components/SelectRangePicker';
import SelectSearch from '../components/SelectSearch';

@connect(({ loading, trade, global }) => ({
  columns: trade.columns, // 指标列
  data: trade.data, // 数据
  paramsTransaction: trade.paramsTransaction, // 参数
  districts: global.districts, // 地区
  products: global.products, // 产品列表
  teamtags: global.teamtags, // 市场列表
  dataSourceLoading: loading.effects['trade/fetch'],
  districtsLoading: loading.effects['global/fetchDistrict'],
}))
class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickSearch = () => {
    // 查询
    const { dispatch, paramsTransaction } = this.props;
    dispatch({
      type: 'trade/fetch',
      payload: paramsTransaction,
    });
  };

  handleClickReset = () => {
    // 重置
    const { dispatch } = this.props;
    dispatch({
      type: 'trade/resetParam',
    });
    dispatch({
      type: 'trade/fetch',
    });
  };

  handleClickDownload = () => {
    // 下载
    const { dispatch, paramsTransaction } = this.props;
    dispatch({
      type: 'trade/download',
      payload: paramsTransaction,
    });
  };

  switchOptions = dataIndex => {
    // 选择器的Options
    const { districts, products, teamtags } = this.props;

    switch (dataIndex) {
      case 'productName':
        return products;
      case 'teamName':
        return teamtags;
      case 'district':
        return districts;
      case 'channelName':
        return ['分销', '早团', '票务'];
      case 'refundStatus':
        return ['已取消', '已完成', '已确认', '未确认', '已退款'];
      case 'refundType':
        return ['订货订单退货', '分销发货单退货', '零售订单退货', '换货单退货', '其他未识别退货'];
      case 'ifvirtual':
        return ['实际发货', '虚拟发货'];
      default:
        return [];
    }
  };

  switchSelect = title => {
    // 选择器
    switch (title) {
      case '下拉输入选择':
        return SelectDefault;
      case '搜索框':
        return SelectSearch;
      case '时间选择':
        return SelectRangePicker;
      case '级联选择':
        return SelectCascader;
      default:
        return null;
    }
  };

  renderSelect() {
    const { columns } = this.props;
    const RowLiist = [];
    const ListObj = {};

    columns.forEach(col => {
      const { select } = col;
      if (select) {
        const { group } = select;

        if (ListObj[group]) {
          ListObj[group].push(col);
        } else {
          ListObj[group] = [group, col];
        }
      }
    });

    ['时间选项', '其他选项', '关键字搜索'].forEach((key, i, arr) => {
      if (ListObj[key]) {
        const ColList = [];
        ListObj[key].forEach((li, j) => {
          if (j === 0) {
            ColList.push(
              <Col className="m-bottom-16 m-right-24" key={li}>
                {li}：
              </Col>
            );
          } else {
            const Select = this.switchSelect(li.select.title);

            ColList.push(
              <Col className="m-bottom-16 m-right-32" key={li.dataIndex}>
                <Select
                  ref={ref => {
                    this[`${li.dataIndex}`] = ref;
                  }}
                  placeholder={li.title}
                  options={this.switchOptions(li.dataIndex)}
                  dataIndex={li.dataIndex}
                />
              </Col>
            );
          }
        });

        switch (i) {
          case 0:
            RowLiist.push(
              <Row type="flex" justify="start" align="middle" key={key}>
                {ColList}
              </Row>
            );
            break;
          case arr.length - 1:
            RowLiist.push(
              <Row
                className="p-top-16 b-top-dashed"
                type="flex"
                justify="start"
                align="middle"
                key={key}
              >
                {ColList}
                <Col className="m-bottom-16" style={{ flex: '1 0 auto' }}>
                  <Button className="float-r" onClick={this.handleClickReset}>
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className="m-right-8 float-r"
                    onClick={this.handleClickSearch}
                  >
                    查询
                  </Button>
                </Col>
              </Row>
            );
            break;
          default:
            RowLiist.push(
              <Row
                className="p-top-16 b-top-dashed"
                type="flex"
                justify="start"
                align="middle"
                key={key}
              >
                {ColList}
              </Row>
            );
            break;
        }
      }
    });

    return RowLiist;
  }

  render() {
    const { data, dataSourceLoading, columns, dispatch, paramsTransaction } = this.props;

    return (
      <Fragment>
        <div className="container m-top-8">{this.renderSelect.call(this)}</div>
        <div className="container m-top-8">
          <Row type="flex" justify="space-between" align="middle">
            <Col className="m-bottom-16">共检索到 {data.total} 条数据</Col>
            <Col className="m-bottom-16">
              <Button icon="download" onClick={this.handleClickDownload}>
                下载
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="antTableRowKey"
            dataSource={data.records.map((item, i) => {
              return {
                ...item,
                antTableRowKey: i,
              };
            })}
            columns={columns}
            pagination={{
              onChange: (pageNo, pageSize) => {
                dispatch({
                  type: 'trade/changeParam',
                  payload: {
                    pageNo,
                    pageSize,
                  },
                });
                dispatch({
                  type: 'trade/fetch',
                  payload: {
                    ...paramsTransaction,
                    pageNo,
                    pageSize,
                  },
                });
              },
              onShowSizeChange: (pageNo, pageSize) => {
                dispatch({
                  type: 'trade/changeParam',
                  payload: {
                    pageSize,
                  },
                });
                dispatch({
                  type: 'trade/fetch',
                  payload: {
                    ...paramsTransaction,
                    pageNo,
                    pageSize,
                  },
                });
              },
              current: data.current,
              total: data.total,
              showSizeChanger: true,
              pageSizeOptions: ['10', '500', '1000', '5000'],
              showQuickJumper: true,
            }}
            loading={dataSourceLoading}
          />
        </div>
      </Fragment>
    );
  }
}

export default Trade;
