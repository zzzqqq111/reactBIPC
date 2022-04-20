import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

@connect(({ userManage }) => ({
  dataInfo: userManage.dataInfo,
}))
class Permiss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps = nextProps => {
    const { dataInfo = {} } = nextProps;
    const { instanceData = {} } = dataInfo;
    if (instanceData.systemPermissionIds && instanceData.systemPermissionIds.length !== 0) {
      this.setState({
        selectedRowKeys: instanceData.systemPermissionIds,
      });
    }
  };

  render() {
    const { dispatch, data = [], loading = false, showIndicator = () => {} } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection1 = {
      selectedRowKeys,
      onChange: selectRowItem => {
        dispatch({
          type: 'userManage/changeDataPermiss',
          payload: selectRowItem,
        });
        this.setState({
          selectedRowKeys: selectRowItem,
        });
      },
      getCheckboxProps: record => {
        return {
          checked:
            selectedRowKeys && selectedRowKeys.length !== 0
              ? selectedRowKeys.indexOf(record.key) >= 0
              : '',
        };
      },
    };
    return (
      <Table
        rowSelection={rowSelection1}
        loading={loading}
        dataSource={data}
        columns={[
          {
            title: '功能',
            dataIndex: 'moduleName',
            render: (value, row, index) => {
              const obj = {
                children: value,
                props: {},
              };
              if (index === 3) {
                obj.props.rowSpan = 2;
              }
              if (index === 4) {
                obj.props.rowSpan = 0;
              }
              return obj;
            },
          },
          {
            title: '权限配置',
            dataIndex: 'name',
          },
          {
            title: '',
            render: (_, record) => (
              <span>
                {record.id === 2 ? (
                  <a
                    onClick={() => {
                      showIndicator();
                    }}
                  >
                    指标管理
                  </a>
                ) : null}
              </span>
            ),
          },
        ]}
        pagination={false}
      />
    );
  }
}

export default Permiss;
