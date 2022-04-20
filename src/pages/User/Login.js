import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, message, notification } from 'antd';
import Login from '@/components/Login';
import crypto from '@/utils/crypto';
import styles from './Login.less';

// const IS_LOCAL_HOST = global.location.hostname === 'localhost';

const {
  Tab,
  // UserName, Password,
  Mobile,
  Captcha,
  Submit,
} = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'mobile',
    deviceNo: '', // 设备号
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 创建WebSocket连接
    const socket = new WebSocket('ws://localhost:26480/echo');

    // 连接成功
    socket.addEventListener('open', () => {
      socket.send('get_serial_number');

      notification.success({
        key: 'socket',
        message: '密钥已成功连接',
        description: '为了能正常访问页面,请不要关闭密钥!',
      });
    });

    // 连接失败
    socket.addEventListener('error', () => {
      notification.error({
        key: 'socket',
        message: '密钥连接失败',
        description: '请重新运行密钥，并刷新页面',
      });
    });

    // 连接关闭
    socket.addEventListener('close', () => {
      if (window.location.pathname !== '/user/login') {
        dispatch({
          type: 'login/logout',
        });
      }

      notification.error({
        key: 'socket',
        message: '密钥已关闭',
        description: '请重新运行密钥，并刷新页面',
      });
    });

    // 从服务器接收到信息
    socket.addEventListener('message', event => {
      const deviceNo = JSON.parse(event.data).Md5;
      // if (packageInfo.env === 'beta' && IS_LOCAL_HOST) {
      //   // 本地测试环境 设备号
      //   deviceNo = 123456;
      // }
      this.setState({ deviceNo });
    });
  }

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['phone'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          /* eslint no-undef: "off" */
          initNECaptcha(
            {
              element: '#captcha',
              captchaId: 'da2fb7ff99bc4f57b52a9ee17cbed0f3',
              mode: 'embed', // 仅智能无感知验证码时，mode 才能设置为 bind
              width: '360px', // model有最大宽度400
              onVerify: (error, data) => {
                if (error) {
                  return message.error('验证失败');
                }

                dispatch({
                  type: 'login/getCaptcha',
                  payload: {
                    phone: values.phone,
                    checkCode: crypto(values.phone),
                    validate: data.validate,
                    captchaId: 'da2fb7ff99bc4f57b52a9ee17cbed0f3',
                  },
                })
                  .then(resolve())
                  .catch(reject());

                return message.success('验证成功');
              },
            },
            captchaIns => {
              // 初始化成功后得到验证实例instance，可以调用实例的方法
              this.captchaIns = captchaIns;
            },
            () => {
              // 初始化失败后触发该函数，err对象描述当前错误信息
            }
          );
        }
      });
    });

  handleSubmit = (err, values) => {
    const { deviceNo } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          // type,
          deviceNo,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {/* <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab> */}
          <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <Mobile
              name="phone"
              placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.phone-number.required' }),
                },
                // {
                //   pattern: /^1\d{10}$/,
                //   message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                // },
              ]}
            />
            <Captcha
              name="code"
              placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
              // countDown={60}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.verification-code.required' }),
                },
              ]}
            />
          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
        <div id="captcha" />
      </div>
    );
  }
}

export default LoginPage;
