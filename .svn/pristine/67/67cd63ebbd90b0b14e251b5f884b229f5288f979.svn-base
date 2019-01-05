import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  TouchableHighlight,
  DeviceEventEmitter
} from "react-native";
import { withNavigation } from "react-navigation";
import { EVENT } from "../utility/dict";
import { utility } from "../utility";
import { IMAGE_PATH, IMG_TYPE } from "../utility/dict";
import { ResourcePath } from "../services/urlConfig";

class LeftUserInfo extends Component {
  constructor(props) {
    super(props);
    this.changeIcon = null;
    this.recharge = null;
    this.checkClickTimer = null;
    this.isClick = false;
    this.state = {
      image: { uri: "asset:/userAvatar/default.png" },
      mobile: "",
      VipDays: ""
    };
  }

  componentDidMount() {
    this.setUserIcon();
    this.computedVipDays();
    this.changeIcon = DeviceEventEmitter.addListener(
      EVENT.CHANGE_ICON,
      data => {
        //监听头像的变化
        this.setUserIcon();
      }
    );
    this.recharge = DeviceEventEmitter.addListener(EVENT.RECHARGE, data => {
      //监听充值的变化
      this.computedVipDays();
    });
  }

  componentWillUnmount() {
    this.changeIcon && this.changeIcon.remove();
    this.recharge && this.recharge.remove();
    this.checkClickTimer && clearTimeout(this.checkClickTimer);
  }
  setUserIcon() {
    utility.getCurrUserInfo().then(item => {
      if (item) {
        let icon = item.icon || "asset:/userAvatar/default.png";
        this.setState({
          image: { uri: icon }
        });
      }
    });
    // utility.getUsersInfo().then(res => {
    //   if (res) {
    //     let currUserInfo = res.currUserInfo;
    //     let icon = currUserInfo.icon || "asset:/userAvatar/default.png";
    //     this.setState({
    //       image: { uri: icon }
    //     });
    //   }
    // });
  }
  clickTimeout() {
    this.isClick = true;
    this.checkClickTimer = setTimeout(() => {
      this.isClick = false;
      this.checkClickTimer && clearTimeout(this.checkClickTimer);
    }, 500);
  }
  computedVipDays() {
    utility.getCurrUserInfo().then(item => {
      if (item) {
        let text = "";
        if (item.vipDeadTime) {
          text = utility.getVipDescription(item.vipDeadTime, item.serverTime);
        } else {
          text = "还未充值VIP哦";
        }
        let mobile = item.name || item.mobile || "您还未绑定手机号";
        this.setState({ VipDays: text, mobile: mobile });
      }
    });
  }
  render() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
        onPress={() => {
          if (!this.isClick) {
            this.clickTimeout();
            this.props.navigation.navigate("ChangeUserInfo");
          }
        }}
      >
        <View
          style={[styles.container, { flexDirection: "row", marginLeft: 20 }]}
        >
          <View style={styles.imgBox}>
            <Image
              source={this.state.image}
              style={styles.img}
              defaultSource={{
                uri: "asset:/userAvatar/default.png",
                width: 100,
                height: 100,
                scale: 1
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}
          >
            <Text style={{ color: "#D3DD7F" }}>{this.state.mobile}</Text>
            <View style={[styles.container, { flexDirection: "row" }]}>
              <Text style={styles.text}>{this.state.VipDays}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start"
  },
  imgBox: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden"
  },
  img: {
    width: 40,
    height: 40
  },
  text: {
    color: "#ffffff",
    fontSize: 12
  }
});

export default withNavigation(LeftUserInfo);
