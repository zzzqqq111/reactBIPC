/**
 *  实例管理
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Divider, Button } from 'antd';

@connect(({ dbInstance, loading }) => ({
  list: dbInstance.list,
  listLoading: loading.effects['dbInstance/fetchList'],
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dbInstance/fetchList',
    });
  }

  render() {
    const { list, listLoading, dispatch } = this.props;

    return (
      <div>
        <Button
          onClick={() => {
            router.push('/back/dbInstance/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增实例
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '实例名称', dataIndex: 'name' },
            { title: 'HOST', dataIndex: 'host' },
            { title: '端口', dataIndex: 'port' },
            { title: '用户名', dataIndex: 'username' },
            { title: '类型', dataIndex: 'dbType' },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/dbInstance/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'dbInstance/delete',
                        payload: {
                          id: record.id,
                        },
                      });
                    }}
                  >
                    删除
                  </a>
                </span>
              ),
            },
          ]}
        />
      </div>
    );
  }
}

export default Index;
