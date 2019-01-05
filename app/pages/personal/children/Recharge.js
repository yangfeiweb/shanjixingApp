/**
 * 个人中心充值组件
 */

import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Image,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import PropTypes from "prop-types";
import dismissKeyboard from "react-native-dismiss-keyboard";
import PopupDialog, {
  SlideAnimation,
  DialogTitle,
  DialogButton
} from "react-native-popup-dialog";
import { Header, Loading } from "../../../components";
import globalStyle from "../../../globalStyle";
import dataService from "../../../services";
import { utility } from "../../../utility";
import { EVENT } from "../../../utility/dict";

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});
export default class Recharge extends PureComponent {
  constructor(props) {
    super(props);
    this.popupDialog = null;
    this.accout = null;
    this.rechargePwd = null;
    this.payType = "CHARGE_CARD";
    // this.tradeType ="CHARGE_CARD"
  }
  componentDidMount() {
    // this.loading.show()
  }
  doRecharge() {
    //充值
    const { Loading } = this.props;
    if (!this.rechargePwd) {
      utility.Toast("请输入充值密码");
      return;
    }
    Loading && Loading.show();
    dataService.createOrder(this.rechargePwd, this.payType, this.payType).then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          utility.Toast("充值成功");
          let data = res.data;
          this.rechargePwd = null;
          this.refs.TextInput && this.refs.TextInput.clear();
          let orderNo = data.orderNo;
          this.syncUserInfo();
        }
        if (code === 500) {
          utility.Toast(msg);
        }
        Loading && Loading.hide();
      },
      err => {
        Loading && Loading.hide();
      }
    );
  }
  syncUserInfo() {
    dataService.getUsersInfo().then(res => {
      let code = res.code;
      let msg = res.msg;
      if (code === 200) {
        let usersInfo = res.data;
        AsyncStorage.getItem("studentNo").then(studentNo => {
          if (studentNo) {
            AsyncStorage.getItem("usersInfo").then(res => {
              if (res) {
                let data = JSON.parse(res);
                let index = data.findIndex(
                  item => item.studentNo === studentNo
                );
                if (index !== -1) {
                  let item = data[index];
                  let obj = Object.assign(item, usersInfo);
                  data.splice(index, 1, obj);
                  AsyncStorage.setItem("usersInfo", JSON.stringify(data)).then(
                    res => {
                      DeviceEventEmitter.emit(EVENT.RECHARGE); //推送充值事件
                    }
                  );
                }
              }
            });
          }
        });
      }
    });
  }
  show() {
    this.popupDialog && this.popupDialog.show();
  }
  hide() {
    this.popupDialog && this.popupDialog.dismiss();
  }
  onShown() {
    this.refs.TextInput && this.refs.TextInput.clear();
  }
  render() {
    return (
      <PopupDialog
        dialogAnimation={slideAnimation}
        width={380}
        height={230}
        onShown={this.onShown.bind(this)}
        dialogTitle={
          <DialogTitle
            title="账户充值"
            titleStyle={{ backgroundColor: globalStyle.color.primary }}
            titleTextStyle={{ color: "#fff" }}
          />
        }
        dismissOnTouchOutside={false}
        ref={popupDialog => {
          this.popupDialog = popupDialog;
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[{ margin: 10, alignSelf: "center" }, styles.text]}>
            使用充值码给账号充值
          </Text>
          <View style={styles.item}>
            <Text style={styles.text}>充值密码:</Text>
            <TextInput
              ref="TextInput"
              placeholderTextColor="#5ABEFF"
              onChangeText={text => {
                this.rechargePwd = text;
              }}
              placeholder="请输入密码"
              placeholderTextColor="#fff"
              maxLength={30}
              underlineColorAndroid="transparent"
              selectionColor="#FFD05C"
              style={styles.input}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 5
          }}
        >
          <DialogButton
            text="取消"
            buttonStyle={styles.btn}
            onPress={() => {
              this.popupDialog && this.popupDialog.dismiss();
            }}
          />
          <DialogButton
            text="确认"
            buttonStyle={[styles.btn, { backgroundColor: "#56BDFF" }]}
            textStyle={{ color: "#fff" }}
            onPress={() => {
              this.doRecharge();
            }}
          />
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  text: {
    color: "#56BDFF",
    fontSize: 18
  },
  input: {
    width: "50%",
    height: 40,
    borderWidth: 2,
    borderColor: "#56BDFF",
    marginLeft: 10,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  // footBtns: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   marginTop: 20
  // },
  // borderShadow: {
  //     paddingHorizontal: 20,
  //     shadowOffset: { width: 4, height: 4 },
  //     shadowColor: '#5ABEFF',
  //     shadowOpacity: 0.7,
  //     shadowRadius: 2,
  //     elevation: 2,
  // },
  btn: {
    width: 150,
    height: 50,
    // paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#56BDFF",
    borderRadius: 15
  }
});
