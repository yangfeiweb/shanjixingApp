import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from "react-native";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FdIcons from "react-native-vector-icons/Foundation";
import { auth } from "../../../controller";
import registryStyles from "./styles";
import dataService from "../../../services";
import { utility } from "../../../utility";
export default class extends Component {
  constructor(props) {
    super(props);
    this.sendCaptchaType = "REGISTER";
    this.registerType = "MOBILE";
    this.timer = null;
    this.mobile = null; //用户手机号
    this.captchaKey = null; //存放用户发送过验证码之后返回的 验证码编码
    this.captchaCode = null; //用户输入 的验证码
    this.userPwd = null; //密码
  }
  state = {
    timeText: "获取验证码",
    disableCaptchaBtn: false
  };
  componentDidMount() {
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //     return true
  // }
  sendCaptcha() {
    //发送验证码
    let Loading = this.props.Loading;
    if (/^1[0-9]{10}$/g.test(this.mobile)) {
      Loading.show();
      dataService.sendCaptcha(this.sendCaptchaType, this.mobile).then(
        res => {
          let code = res.code;
          let msg = res.msg;
          if (code === 200) {
            let data = res.data;
            utility.Toast("验证码已发送");
            this.captchaKey = data.captchaKey;
            this.setState({ disableCaptchaBtn: true });
            this.startTimer();
          }
          if (code === 500) {
            utility.Toast("该手机号已注册");
          }
          Loading.hide();
        },
        err => {
          Loading.hide();
        }
      );
    } else {
      utility.Toast("请确认手机号输入是否正确");
    }
  }
  startTimer() {
    let time = 60;
    this.timer = setInterval(() => {
      if (time <= 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.setState({ timeText: `重新获取` });
        this.setState({ disableCaptchaBtn: false });
      } else {
        this.setState({ timeText: `${time--}s` });
      }
    }, 1000);
  }
  registerPhone() {
    if (!/^1[0-9]{10}$/g.test(this.mobile)) {
      utility.Toast("请确认手机号输入是否正确！");
      return;
    }
    if (!/^\d{4,6}$/g.test(this.captchaCode)) {
      utility.Toast("请确认验证码输入是否正确");
      return;
    }
    if (!this.userPwd) {
      utility.Toast("请输入密码");
      return;
    }

    //开始注册
    let Loading = this.props.Loading;
    Loading.show();
    let register = dataService.register(
      this.registerType,
      this.mobile,
      this.userPwd,
      this.captchaCode,
      this.captchaKey
    );
    register.then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          utility.Toast("注册成功,即将登陆");
          auth.doLogin(this.mobile, this.userPwd).then(
            loginRes => {
              //登陆
              this.props.registerAfter(true); //登陆成功
              Loading.hide();
            },
            err => {
              Loading.hide();
            }
          );
        }

        if (code === 500) {
          utility.Toast(msg);
        }
        Loading.hide();
      },
      err => {
        Loading.hide();
      }
    );
  }
  getUserPhone(val) {
    //获取用户输入的手机号
    this.mobile = val;
    // if (/^1[0-9]{10}$/g.test(val)) {
    // }
  }
  getCaptchaCode(val) {
    //获取用户输入的验证码
    this.captchaCode = val;
  }
  getUserPwd(val) {
    //获取用户输入的验密码码
    this.userPwd = val;
  }
  checkPwd() {
    if (this.userPwd && this.userPwd < 6) {
      utility.Toast("请至少输入六位密码");
      return false;
    }
    return true;
  }

  _inputOnFocus() {}
  render() {
    return (
      <View style={[registryStyles.registryContainer, registryStyles.inputBox]}>
        <View style={[registryStyles.inputItems, registryStyles.borderBottom]}>
          <MCIcons name="account" size={20} color="#5ABEFF" />
          <TextInput
            style={registryStyles.textInput}
            onChangeText={this.getUserPhone.bind(this)}
            placeholder="请输入手机号"
            underlineColorAndroid="transparent"
            maxLength={11}
            onFocus={this._inputOnFocus.bind(this)}
          />
        </View>
        <View style={[registryStyles.inputItems, registryStyles.borderBottom]}>
          <FdIcons name="shield" size={20} color="#5ABEFF" />
          <TextInput
            style={registryStyles.textInput}
            onChangeText={this.getCaptchaCode.bind(this)}
            placeholder="请输入验证码"
            underlineColorAndroid="transparent"
            maxLength={6}
            onFocus={this._inputOnFocus.bind(this)}
          />
          <TouchableOpacity
            style={registryStyles.captcha}
            onPress={this.sendCaptcha.bind(this)}
            disabled={this.state.disableCaptchaBtn}
            activeOpacity={0.9}
          >
            <Text style={registryStyles.textColor}>{this.state.timeText}</Text>
          </TouchableOpacity>
        </View>
        <View style={[registryStyles.inputItems, registryStyles.borderBottom]}>
          <MCIcons name="lock-open" size={20} color="#5ABEFF" />
          <TextInput
            onBlur={() => {}}
            style={registryStyles.textInput}
            secureTextEntry={true}
            onChangeText={this.getUserPwd.bind(this)}
            placeholder="请输入密码"
            underlineColorAndroid="transparent"
            maxLength={40}
            onFocus={this._inputOnFocus.bind(this)}
          />
        </View>
      </View>
    );
  }
}
