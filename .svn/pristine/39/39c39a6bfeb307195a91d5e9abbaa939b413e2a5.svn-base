import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage
} from "react-native";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import registryStyles from "./styles";
import dataService from "../../../services";
import { utility } from "../../../utility";
export default class extends Component {
  constructor(props) {
    super(props);
    this.registerType = "EMAIL";
    this.userEmail = null;
    this.userPwd = null;
  }
  getUserEmail(val) {
    //获取用户输入的邮箱
    this.userEmail = val;
  }
  getUserPwd(val) {
    //获取用户输入的验密码码
    this.userPwd = val;
  }
  checkEmail(e) {
    if (!this.userEmail) {
      if (!e) {
        utility.Toast("请输入邮箱");
      }
      return false;
    }
    let email = /@|./g.test(this.userEmail);
    if (!email) {
      utility.Toast("请确认邮箱格式是否正确");
      return false;
    }
    return true;
  }
  checkUserPwd() {
    if (this.userPwd && this.userPwd.length < 6) {
      utility.Toast("请至少输入六位密码");
      return false;
    }
    return true;
  }
  registerEmail() {
    // Alert.alert("邮箱注册")
    const { Loading, registerAfter } = this.props;
    Loading.show();
    dataService.register(this.registerType, this.userEmail, this.userPwd).then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          Loading.hide();
          utility.Toast("激活链接已发送,请登陆邮箱激活!");
          setTimeout(() => {
            registerAfter && registerAfter();
          }, 500);
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
  _inputOnFocus() {}
  render() {
    return (
      <View style={[registryStyles.registryContainer, registryStyles.inputBox]}>
        <View style={[registryStyles.inputItems, registryStyles.borderBottom]}>
          <MCIcons name="account" size={20} color="#5ABEFF" />
          <TextInput
            onBlur={this.checkEmail.bind(this)}
            style={registryStyles.textInput}
            onChangeText={this.getUserEmail.bind(this)}
            placeholder="请输入邮箱"
            underlineColorAndroid="transparent"
            maxLength={40}
            onFocus={this._inputOnFocus.bind(this)}
          />
        </View>
        <View style={[registryStyles.inputItems, registryStyles.borderBottom]}>
          <MCIcons name="lock-open" size={20} color="#5ABEFF" />
          <TextInput
            onBlur={this.checkUserPwd.bind(this)}
            style={registryStyles.textInput}
            secureTextEntry={true}
            onChangeText={this.getUserPwd.bind(this)}
            placeholder="请输入密码"
            underlineColorAndroid="transparent"
            maxLength={40}
            onFocus={this._inputOnFocus.bind(this)}
          />
        </View>
        <View>
          <TouchableOpacity />
        </View>
      </View>
    );
  }
}
