import React from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { Button, Item } from "native-base";
import FIcons from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { withNavigation, NavigationActions } from "react-navigation";

import { Header, Loading } from "../../components";
import PersonalInfo from "./children/PersonalInfo";
import globalStyle from "../../globalStyle";
import dataService from "../../services";
import { ResourcePath } from "../../services/urlConfig";
import { utility } from "../../utility";
import { EVENT, IMAGE_PATH, IMG_TYPE } from "../../utility/dict";
import { About } from "./children/about";
import LogoutDialog from "./children/LogoutDialog";
import SelectIcon from "./ChangeIcon";

class Personal extends React.Component {
  constructor(props) {
    super(props);
    this.scrollView = null;
    this.ActionSheet = null;
    this.Loading = null;
    this.changeIconEvent = null;
    this.rechargeEvent = null;
    this.state = {
      userIcon: { uri: "asset:/userAvatar/default.png" },
      VipDays: "",
      name: ""
    };
    this.itemButtons = [
      {
        fn: () => {
          // this.props.navigation.navigate("Recharge");
          DeviceEventEmitter.emit("showRecharge");
        },
        Icon: require("../../assets/images/recharge.png"),
        name: "充值"
      },
      {
        fn: () => {
          this.props.navigation.navigate("Chart");
        },
        Icon: require("../../assets/images/study_statistics.png"),
        name: "学习统计"
      },
      {
        fn: () => {
          this.props.navigation.navigate("ChangePwd");
        },
        Icon: require("../../assets/images/change_pwd.png"),
        name: "修改密码"
      },
      {
        fn: () => {
          this.props.navigation.navigate("TestResult");
        },
        Icon: require("../../assets/images/test_result.png"),
        name: "测试成绩"
      },
      {
        fn: () => {
          this.refs.AboutDialog.show();
        },
        Icon: require("../../assets/images/about.png"),
        name: "关于"
      }
    ];
    this.downLoadShow = this.downLoadShow.bind(this);
    this.logoutToUserList = this.logoutToUserList.bind(this);
  }

  componentDidMount() {
    this.changeIconEvent = DeviceEventEmitter.addListener(
      EVENT.CHANGE_ICON,
      data => {
        //监听头像的变化
        this.showUserIcon();
      }
    );
    this.rechargeEvent = DeviceEventEmitter.addListener(
      EVENT.RECHARGE,
      data => {
        //监听用户的充值
        this.computedVip();
      }
    );
    this.computedVip();
    this.showUserIcon();
  }
  componentWillUnmount() {
    this.changeIconEvent && this.changeIconEvent.remove();
    this.rechargeEvent && this.rechargeEvent.remove();
  }
  showUserIcon() {
    utility.getCurrUserInfo().then(item => {
      if (item) {
        this.setState({
          userIcon: { uri: item.icon },
          name: item.name || "未填写姓名"
        });
      }
    });
  }
  computedVip() {
    //计算Vip
    utility.getCurrUserInfo().then(item => {
      if (item) {
        let text = "";
        if (item.vipDeadTime) {
          text = utility.getVipDescription(item.vipDeadTime, item.serverTime);
        } else {
          text = "还未充值VIP哦";
        }
        this.setState({ VipDays: text });
      }
    });
  }
  changeUserIcon() {
    this.refs.SelectIcon && this.refs.SelectIcon.show();
  }
  logoutToUserList() {
    let actions = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "UserList" })]
    });
    this.props.navigation.dispatch(actions);
  }
  logout() {
    //退出
    this.Loading && this.Loading.show();
    dataService.logout().then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          DeviceEventEmitter.emit("gotoLogin");
        }
        this.Loading && this.Loading.hide();
      },
      err => {
        this.Loading && this.Loading.hide();
      }
    );
  }
  downLoadShow() {
    DeviceEventEmitter.emit("showAPKDownload");
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <View>
          <Header showLeft={false} title="个人中心" />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={[styles.userInfoBox, { justifyContent: "space-between" }]}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.userIcon]}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this.changeUserIcon.bind(this)}
                  activeOpacity={1}
                >
                  <Image
                    source={this.state.userIcon}
                    style={{ width: 100, height: 100 }}
                    defaultSource={{
                      uri: "asset:/userAvatar/default.png",
                      width: 100,
                      height: 100,
                      scale: 1
                    }}
                  />
                </TouchableHighlight>
              </View>
              <View style={styles.userInfo}>
                <TouchableOpacity
                  style={styles.row}
                  activeOpacity={0.8}
                  onPress={() => navigate("ChangeUserInfo")}
                >
                  <FIcons name="edit" size={20} color="#FFA1A1" />
                  <Text style={{ marginLeft: 5 }}>{this.state.name}</Text>
                </TouchableOpacity>
                <View style={[styles.row, { paddingTop: 10 }]}>
                  <FIcons name="clock" size={20} color="#5ABEFF" />
                  <Text style={{ marginLeft: 5 }}>{this.state.VipDays}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
                paddingRight: 20
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.refs.logoutDialog && this.refs.logoutDialog.show();
                }}
                style={{
                  paddingVertical: 10,
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
                <Ionicons
                  name="ios-log-out"
                  color={globalStyle.color.danger}
                  size={25}
                />
                <Text style={{ color: globalStyle.color.danger }}>
                  退出登录
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#F9F9F9"
            }}
          >
            <ScrollView
              contentContainerStyle={{
                width: "100%",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }}
              showsVerticalScrollIndicator={false}
            >
              {this.itemButtons.map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={item.name}
                  style={styles.selectItem}
                  onPress={() => {
                    item.fn && item.fn();
                  }}
                >
                  <View style={styles.userIcon}>
                    <Image
                      source={item.Icon}
                      style={{ width: 100, height: 100 }}
                    />
                  </View>
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <Loading
          ref={ref => {
            this.Loading = ref;
          }}
        />
        <SelectIcon ref="SelectIcon" Loading={this.Loading} />
        <About ref="AboutDialog" downLoadShow={this.downLoadShow} />
        <LogoutDialog
          ref="logoutDialog"
          Loading={this.Loading}
          logoutToUserList={this.logoutToUserList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  userInfoBox: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  userInfo: {
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  selectItem: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: "center"
  },
  itemText: {
    marginTop: 5
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden"
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  ViewShadow: {
    shadowOffset: { width: 4, height: 4 },
    shadowColor: "#5ABEFF",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 2
  },
  userNameBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40
  },
  RechargeBtn: {
    width: 80,
    alignItems: "center",
    backgroundColor: "#FFD541",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5
  },
  quitBtn: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 5
  }
});

export default withNavigation(Personal);
