/**
 * 日期选择
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import moment from 'moment';
import { getNowTime } from '@/utils/timeFormat';

const { RangePicker } = DatePicker;

// const disabledDate = current => {
//   // 不可选择的日期: 不可选择至今三个月外的日期
//   return (
//     current &&
//     (current <
//       moment()
//         .subtract(3, 'M')
//         .subtract(1, 'd') ||
//       current > moment())
//   );
// };

@connect(({ customReport }) => ({
  compareParam: customReport.compareParam,
}))
class SelectCompareRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.getDate();
  };

  onChange = (_, value) => {
    const { dataIndex, dispatch } = this.props;
    if (dataIndex) {
      const newValue = {
        [dataIndex]: `${value[0]}~${value[1]}`,
      };
      dispatch({
        type: 'customReport/saveCompareParam',
        payload: { datetime1: { ...newValue } },
      });
    }
  };

  onChange1 = (_, value) => {
    const { dataIndex, dispatch } = this.props;
    if (dataIndex) {
      const newValue = {
        [dataIndex]: `${value[0]}~${value[1]}`,
      };
      dispatch({
        type: 'customReport/saveCompareParam',
        payload: { datetime2: { ...newValue } },
      });
    }
  };

  getDate = () => {
    const { dispatch, dataIndex } = this.props;
    dispatch({
      type: 'customReport/saveCompareParam',
      payload: getNowTime(dataIndex),
    });
  };

  render() {
    const { compareParam = {}, dataIndex } = this.props;
    let value = {};
    let value1 = {};
    if (!compareParam.datetime1 || !compareParam.datetime2) {
      return null;
    }

    if (compareParam.datetime1[dataIndex] && compareParam.datetime2[dataIndex]) {
      value = compareParam.datetime1[dataIndex].split('~');
      value1 = compareParam.datetime2[dataIndex].split('~');
    }
    return (
      <React.Fragment>
        <RangePicker
          style={{ width: 370 }}
          onChange={this.onChange}
          value={
            compareParam.datetime1[dataIndex] &&
            value[0] &&
            value[1] && [
              moment(value[0], 'YYYY-MM-DD HH:mm:ss'),
              moment(value[1], 'YYYY-MM-DD HH:mm:ss'),
            ]
          }
          showTime={{ defaultValue: [moment().startOf('d'), moment().endOf('d')] }}
        />
        <span style={{ padding: '0 30px', fontSize: '30px' }}>vs</span>
        <RangePicker
          style={{ width: 370 }}
          onChange={this.onChange1}
          value={
            compareParam.datetime2[dataIndex] &&
            value1[0] &&
            value1[1] && [
              moment(value1[0], 'YYYY-MM-DD HH:mm:ss'),
              moment(value1[1], 'YYYY-MM-DD HH:mm:ss'),
            ]
          }
          showTime={{ defaultValue: [moment().startOf('d'), moment().endOf('d')] }}
        />
      </React.Fragment>
    );
  }
}

export default SelectCompareRangePicker;
