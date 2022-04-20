/**
 *  选择市场或者品牌
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Checkbox } from 'antd';

const { Option } = Select;

@connect()
class ShowSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkValue: [],
    };
  }

  onCheckAllChange = e => {
    const { options = [] } = this.props;
    const arr = options.map(item => {
      return item.name;
    });
    if (e.target.checked) {
      this.setState({
        checkValue: arr,
      });
    } else {
      this.setState({
        checkValue: [],
      });
    }
  };

  optionChange = value => {
    this.setState({
      checkValue: value,
    });
  };

  render() {
    const { options = [], title = '', optionChange = () => {} } = this.props;
    const { checkValue } = this.state;
    return (
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        allowClear
        onChange={optionChange}
        value={checkValue}
      >
        <Option value="all">
          <Checkbox onChange={this.onCheckAllChange}>{title}</Checkbox>
        </Option>
        {options.map(item => (
          <Option key={item.key} value={item.name}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  }
}
export default ShowSelect;
