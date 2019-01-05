import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { Text, Content, ListItem, Button, CheckBox, Body } from "native-base";
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";
import commonStyle from "../../../globalStyle";
import { utility } from "../../../utility";
import dataService from "../../../services";

const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

export default class extends Component {
  constructor(props) {
    super(props);
    this.Loading = props.Loading;
    this.logout = this.logout.bind(this);
    this.state = {
      checked: false
    };
  }
  componentDidMount() {}
  show() {
    this.refs.popDialog && this.refs.popDialog.show();
  }
  hide() {
    this.refs.popDialog && this.refs.popDialog.dismiss();
  }
  logout() {
    dataService.logout().then(
      res => {
        let code = res.code;
        let msg = res.msg;
        this.backLogin();
      },
      err => {
        this.backLogin();
      }
    );
  }
  backLogin() {
    let { logoutToUserList } = this.props;
    if (this.state.checked) {
      AsyncStorage.getItem("currUser").then(res => {
        if (res) {
          let item = JSON.parse(res);
          item.password = "";
          AsyncStorage.setItem("currUser", JSON.stringify(item)).then(
            () => {},
            err => {}
          );
        }
      });
      utility.getUsersInfo().then(
        res => {
          let currUserInfo = res.currUserInfo;
          let usersInfo = res.usersInfo;
          currUserInfo.password = "";

          AsyncStorage.setItem("usersInfo", JSON.stringify(usersInfo)).then(
            () => {
              // DeviceEventEmitter.emit("gotoLogin");
              logoutToUserList && logoutToUserList();
            },
            () => {
              logoutToUserList && logoutToUserList();
              // DeviceEventEmitter.emit("gotoLogin");
            }
          );
        },
        err => {
          logoutToUserList && logoutToUserList();
        }
      );
    } else {
      logoutToUserList && logoutToUserList();
      // DeviceEventEmitter.emit("gotoLogin");
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.checked !== nextState.checked;
  }
  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={450}
        height={260}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="退出提示"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text>确认退出</Text>
            </View>
            <ListItem
              onPress={() => {
                this.setState({
                  checked: !this.state.checked
                });
              }}
            >
              <CheckBox
                checked={this.state.checked}
                onPress={() => {
                  this.setState({
                    checked: !this.state.checked
                  });
                }}
                color={commonStyle.color.success}
              />
              <Body>
                <Text>是否清除登录密码</Text>
              </Body>
            </ListItem>
          </View>
          <View style={styles.groupBtn}>
            <Button
              style={[
                styles.btn,
                { backgroundColor: commonStyle.color.lightRed }
              ]}
              onPress={() => {
                this.hide();
              }}
            >
              <Text style={{ color: commonStyle.color.primary }}>取消</Text>
            </Button>
            <Button
              style={[
                styles.btn,
                { backgroundColor: commonStyle.color.primary }
              ]}
              onPress={this.logout}
            >
              <Text>确认</Text>
            </Button>
          </View>
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  groupBtn: {
    width: "100%",
    height: 70,
    paddingVertical: 15,
    // padding: 5,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  btn: {
    width: 150,
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});
