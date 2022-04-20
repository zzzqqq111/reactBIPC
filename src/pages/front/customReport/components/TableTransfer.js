/**
 * 编辑报表
 */
import React from 'react';
import { connect } from 'dva';
import { Transfer, Table } from 'antd';
import difference from 'lodash/difference';

@connect()
class TableTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { leftColumns, rightColumns, fixId } = this.props;
    const content = ({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      // disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: item => ({ disabled: item.id === fixId }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          pagination={false}
          scroll={{ y: 240 }}
        />
      );
    };
    return (
      <Transfer {...this.props} showSelectAll={false}>
        {content}
      </Transfer>
    );
  }
}

export default TableTransfer;
