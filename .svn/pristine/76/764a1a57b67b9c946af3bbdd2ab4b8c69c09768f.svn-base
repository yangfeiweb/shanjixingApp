import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { Text, Content, Form, Item, Input, Button, Label } from "native-base";
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";
import commonStyle from "../globalStyle";
import { utility } from "../utility";
import { EVENT } from "../utility/dict";
import dataService from "../services";
const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });
export default class extends Component {
  constructor(props) {
    super(props);
    this.mobileChange = this.mobileChange.bind(this);
    this.captchaChange = this.captchaChange.bind(this);
    this.commit = this.commit.bind(this);
    this.sendCodeTimer = null;
    this.captchaKey = "";
    this.captchaCode = "";
    this.mobile = "";
    this.state = {
      disabled: false,
      sendCodeText: "发送验证码"
    };
  }
  componentWillUnmount() {
    this.clearTimer();
  }
  showLoading() {
    this.props.showLoading && this.props.showLoading();
  }
  hideLoading() {
    this.props.hideLoading && this.props.hideLoading();
  }
  show() {
    this.refs.popDialog && this.refs.popDialog.show();
  }
  hide() {
    this.refs.popDialog && this.refs.popDialog.dismiss();
  }
  mobileChange(val) {
    this.mobile = val;
  }
  interval() {
    this.setState({
      disabled: true
    });
    let time = 60;
    this.sendCodeTimer = setInterval(() => {
      if (time <= 0) {
        this.clearTimer();
        this.setState({
          disabled: false,
          sendCodeText: "重新发送"
        });
      } else {
        this.setState({
          sendCodeText: `(${time}s)`
        });
        time--;
      }
    }, 1000);
  }
  clearTimer() {
    if (this.sendCodeTimer) {
      clearInterval(this.sendCodeTimer);
      this.sendCodeTimer = null;
    }
  }
  captchaChange(val) {
    this.captchaCode = val;
  }
  sendCaptchCode() {
    if (!this.checkMobile()) {
      return;
    }
    this.showLoading();
    dataService.sendCaptcha("BIND_MOBILE", this.mobile).then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          utility.Toast("验证码已发送");
          let data = res.data;
          this.captchaKey = data.captchaKey;
          this.interval();
        }
        if (code === 500) {
          utility.Toast(msg);
        }
        this.hideLoading();
      },
      err => {
        this.hideLoading();
      }
    );
  }
  checkCaptchaCode() {
    if (!this.captchaKey) {
      utility.Toast("未获取验证码");
      return false;
    }
    if (!this.captchaCode) {
      utility.Toast("请输入验证码");
      return false;
    }
    return true;
  }
  checkMobile() {
    if (!this.mobile) {
      utility.Toast("请输入手机号");
      return false;
    }
    if (!/\d{11}/g.test(this.mobile)) {
      utility.Toast("手机号格式不正确");
      return false;
    }
    return true;
  }
  commit() {
    if (!this.checkMobile() || !this.checkCaptchaCode()) {
      return;
    }
    this.showLoading();
    dataService.bindMobile(this.mobile, this.captchaCode, this.captchaKey).then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          utility.getCurrUserInfo().then(item => {
            if (item) {
              item.mobile = this.mobile;
              AsyncStorage.setItem("currUser", JSON.stringify(item)).then(
                res => {},
                err => {}
              );
            }
          });
          utility.getUsersInfo().then(res => {
            let currUserInfo = res.currUserInfo;
            let usersInfo = res.usersInfo;
            currUserInfo.mobile = this.mobile;
            AsyncStorage.setItem("usersInfo", JSON.stringify(usersInfo)).then(
              res => {
                DeviceEventEmitter.emit(EVENT.RECHARGE);
              },
              err => {}
            );
          });
          this.hide();
        }
        if (code === 500) {
          utility.Toast(msg);
        }
        this.hideLoading();
      },
      err => {
        this.hideLoading();
      }
    );
  }
  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={400}
        height={300}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="提示"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ color: commonStyle.color.primary }}>
            请绑定手机号，绑定后可用手机号登录
          </Text>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <Item style={styles.item}>
            <Input
              placeholder="请输入手机号"
              underline={false}
              onChangeText={this.mobileChange}
              maxLength={11}
            />
          </Item>
          <Item style={styles.item}>
            <Input
              placeholder="请输入验证码"
              underline={false}
              onChangeText={this.captchaChange}
              maxLength={6}
              minLength={4}
            />
            <Button
              style={{
                width: 150,
                backgroundColor: commonStyle.color.primary,
                borderRadius: 5,
                justifyContent: "center"
              }}
              onPress={() => {
                this.sendCaptchCode();
              }}
              disabled={this.state.disabled}
            >
              <Text>{this.state.sendCodeText}</Text>
            </Button>
          </Item>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 15
          }}
        >
          <Button
            style={[styles.btn, { backgroundColor: commonStyle.color.primary }]}
            onPress={this.commit}
          >
            <Text>确定</Text>
          </Button>
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    width: "60%",
    height: 40,
    borderRadius: 10,
    justifyContent: "center"
  },
  item: {
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});
