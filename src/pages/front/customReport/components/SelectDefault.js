/**
 * 默认选择器
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;

@connect(({ customReport }) => ({
  paramsTransaction: customReport.paramsTransaction,
}))
class SelectDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = value => {
    const { dataIndex, dispatch } = this.props;
    if (dataIndex) {
      dispatch({
        type: 'customReport/changeParam',
        payload: {
          [dataIndex]: value,
        },
      });
    }
  };

  render() {
    const { placeholder, options = [], paramsTransaction, dataIndex } = this.props;
    return (
      <Select
        style={{ width: 135 }}
        placeholder={`请选择${placeholder}`}
        onChange={this.onChange}
        value={paramsTransaction[dataIndex]}
        showSearch
        allowClear
      >
        {options.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Option key={index} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SelectDefault;
