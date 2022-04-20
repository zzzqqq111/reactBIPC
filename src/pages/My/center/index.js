/**
 * 个人中心
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Breadcrumb, Avatar, Row, Col, Button, Table } from 'antd';
import { isAdmin } from '@/utils/role';

@connect(({ center, loading, list }) => ({
  data: center.data,
  listLoading: loading.effects['indicator/fetchList'],
  navId: list.navId,
}))
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'center/fetch',
    });
  }

  render() {
    const { data, listLoading, dispatch } = this.props;
    return (
      <div>
        <div className="container">
          <Breadcrumb>
            {/* <Breadcrumb.Item>雷欧</Breadcrumb.Item> */}
            <Breadcrumb.Item>个人中心</Breadcrumb.Item>
          </Breadcrumb>
          <Row className="m-top-16" type="flex" justify="start" align="middle">
            <Col className="m-bottom-16 m-right-24">
              <Avatar size={72} icon="user" />
            </Col>
            <Col className="m-bottom-16 m-right-24" style={{ flex: 1 }}>
              <p>祝你开心每一天！</p>
              {/* <div>
                交互设计师
                <Divider type="vertical" />
                云创研发－电商项目部－UED－交互设计部
              </div> */}
            </Col>
            {isAdmin() ? (
              <Col>
                <Button
                  onClick={() => {
                    router.push('/back');
                  }}
                >
                  进入数据后台
                </Button>
              </Col>
            ) : null}
          </Row>
        </div>
        <div className="container m-top-8">
          <Row type="flex" justify="space-between" align="middle">
            <Col className="m-bottom-16">下载列表</Col>
          </Row>
          <div className="p-bottom-60">
            <Table
              rowKey="id"
              loading={listLoading}
              dataSource={data}
              columns={[
                {
                  title: '报表名称',
                  dataIndex: 'name',
                  render: text => <span>{text}.xlsx</span>,
                },
                {
                  title: '下载时间',
                  dataIndex: 'createdTime',
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                },
                {
                  title: '操作',
                  render: (_, record) => (
                    <span>
                      {/* <a onClick={() => {}}>{record.status === '未下载' ? '下载' : '重新下载'}</a>
                      <Divider type="vertical" /> */}
                      <a
                        onClick={() => {
                          dispatch({
                            type: 'center/deleteDownload',
                            payload: {
                              name: record.name,
                            },
                            callback: () => {
                              dispatch({
                                type: 'center/fetch',
                              });
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
        </div>
      </div>
    );
  }
}

export default Order;
