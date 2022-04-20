/**
 * 默认选择器
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;

@connect()
class SelectDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = value => {
    const { dataIndex, dispatch, saveRoute } = this.props;
    if (dataIndex) {
      dispatch({
        type: saveRoute,
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
        style={{ width: 150 }}
        placeholder={`请选择${placeholder}`}
        onChange={this.onChange}
        value={paramsTransaction[dataIndex]}
        showSearch
        allowClear
      >
        {options.map(item => (
          <Option key={item.key} value={item.name}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SelectDefault;
