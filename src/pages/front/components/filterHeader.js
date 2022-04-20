/* eslint-disable no-param-reassign */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Select } from 'antd';
import SelectDefault from './SelectDefault';
import SelectRangePicker from './SelectRangePicker';
import SelectSearch from './SelectSearch';

@connect()
class FilterHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndicatorData: {},
      fetchSelectIndicatorData: false,
    };
  }

  switchSelect = title => {
    // 选择器
    switch (title) {
      case '下拉框选择':
        return SelectDefault;
      case '输入框':
        return SelectSearch;
      case '时间选择':
        return SelectRangePicker;
      default:
        return null;
    }
  };

  render() {
    const {
      report = [],
      dispatch,
      handleClickSearch = () => {},
      handleClickReset = () => {},
      saveRoute = '',
      paramsTransaction,
      listData = '',
    } = this.props;
    // @todo 不好的写法，着急回家，以后再改
    const { selectIndicatorData, fetchSelectIndicatorData } = this.state;
    const RowList = [];
    const ListObj = {};
    if (report.length === 0) {
      return (
        <div className="container m-top-4">
          <Row type="flex" justify="start" align="middle">
            <Col className="m-bottom-4 m-right-24">自定义选择器：</Col>
            <Col className="m-bottom-4 m-right-24">
              <Select style={{ width: 200 }} placeholder="请选择" />
            </Col>
          </Row>
        </div>
      );
    }

    report.forEach(item => {
      if (item.selector === '下拉框选择') {
        item.selectorList = [];
        // 还没获取过数据的时候获取一次
        if (!fetchSelectIndicatorData) {
          this.setState({
            fetchSelectIndicatorData: true,
          });
          dispatch({
            type: listData,
            payload: { id: item.id },
          }).then(res => {
            // col.selectorList = res || [];
            if (!res) return;
            const arr = [];
            res.forEach((key, index) => {
              arr.push({ name: key.name, key: index });
            });
            selectIndicatorData[item.id] = arr;
            this.setState({
              selectIndicatorData,
            });
          });
        }
        item.selectorList = selectIndicatorData[item.id] || [];
      }
      const { selector } = item;
      if (selector) {
        if (ListObj[selector]) {
          ListObj[selector].push(item);
        } else {
          ListObj[selector] = [selector, item];
        }
      }
    });

    ['时间选择', '下拉框选择', '输入框'].forEach((key, i, arr) => {
      if (ListObj[key]) {
        const ColList = [];
        ListObj[key].forEach((li, j) => {
          if (j === 0) {
            ColList.push(
              <Col className="m-bottom-4 m-right-32" key={li}>
                {li}：
              </Col>
            );
          } else {
            const SelectCol = this.switchSelect(li.selector);

            ColList.push(
              <Col className="m-bottom-4 m-right-32" key={li.field}>
                <SelectCol
                  ref={ref => {
                    this[`${li.field}`] = ref;
                  }}
                  placeholder={li.name}
                  dataIndex={li.field}
                  options={li.selectorList || []}
                  saveRoute={saveRoute}
                  paramsTransaction={paramsTransaction}
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
              <Row className="p-top-4" type="flex" justify="start" align="middle" key={key}>
                {ColList}
              </Row>
            );
            break;
          default:
            RowList.push(
              <Row className="p-top-4" type="flex" justify="start" align="middle" key={key}>
                {ColList}
              </Row>
            );
            break;
        }
      }
    });
    if (RowList.length === 0) {
      return null;
    }
    return (
      <div className="container p-top-4">
        {RowList}
        <Row className="p-top-4" type="flex">
          <Col className="m-bottom-4" style={{ flex: '1 0 auto' }}>
            <Button
              className="float-r"
              onClick={() => {
                handleClickReset();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              className="m-right-4 float-r"
              onClick={() => {
                handleClickSearch();
              }}
            >
              查询
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FilterHeader;
