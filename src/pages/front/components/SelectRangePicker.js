/**
 * 日期选择
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import moment from 'moment';

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

@connect()
class SelectRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (_, value) => {
    const { dataIndex, dispatch, saveRoute } = this.props;
    if (dataIndex) {
      const newValue = {
        [dataIndex]: `${value[0]}~${value[1]}`,
      };
      dispatch({
        type: saveRoute,
        payload: newValue,
      });
    }
  };

  render() {
    const { placeholder, paramsTransaction, dataIndex } = this.props;
    let value = {};
    let newValue = [];
    if (paramsTransaction[dataIndex] && paramsTransaction[dataIndex] !== '~') {
      value = paramsTransaction[dataIndex].split('~');
      newValue = [moment(value[0], 'YYYY-MM-DD HH:mm:ss'), moment(value[1], 'YYYY-MM-DD HH:mm:ss')];
    }
    return (
      <React.Fragment>
        <span>{placeholder}：</span>
        <RangePicker
          style={{ width: 370 }}
          onChange={this.onChange}
          value={newValue}
          showTime={{ defaultValue: [moment().startOf('d'), moment().endOf('d')] }}
          // disabledDate={disabledDate}
        />
      </React.Fragment>
    );
  }
}

export default SelectRangePicker;
