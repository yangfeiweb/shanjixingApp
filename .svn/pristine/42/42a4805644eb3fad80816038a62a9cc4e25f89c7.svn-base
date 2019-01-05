import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  Image,
  ImageBackground
} from "react-native";
import { Button, Text, Icon } from "native-base";
import { NavigationActions } from "react-navigation";
import { Loading } from "../../components";
import { utility } from "../../utility";
import { auth } from "../../controller";
import { ResourcePath } from "../../services/urlConfig";
import globalStyle from "../../globalStyle";

export default class extends Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      icon: { uri: "asset:/userAvatar/default.png" },
      mobile: ""
    };
    this.isMount = false;
    this.timer = null;
    this.mobile = null;
    this.pwd = null;
    this.loading = null;
    this.doLogin = this.doLogin.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
  }
  componentDidMount() {
    AsyncStorage.getItem("currUser").then(
      res => {
        if (!res) {
          this.replaceCurrRoute("Login");
        } else {
          let item = JSON.parse(res);
          if (!item.password) {
            //没密码调到用户列表
            this.replaceCurrRoute("UserList");
          } else {
            let icon = item.icon;
            if (icon.indexOf("asset") === -1 && icon.indexOf("com") === -1) {
              icon = ResourcePath + icon;
            }
            this.mobile = item.userid;
            this.pwd = item.password;
            this.setState({
              mobile: item.name || this.mobile,
              icon: { uri: icon }
            });
          }
        }
      },
      err => {
        this.replaceCurrRoute("Login");
      }
    );
    // AsyncStorage.getItem("currMobile").then(mobile => {
    //   if (mobile) {
    //     this.getCurrUserInfo(item => item.mobile === mobile);
    //   } else {
    //     AsyncStorage.getItem("userid").then(
    //       userid => {
    //         if (userid) {
    //           this.getCurrUserInfo(item => item.userid === userid);
    //         } else {
    //           this.replaceCurrRoute("Login");
    //         }
    //       },
    //       err => {
    //         this.replaceCurrRoute("Login");
    //       }
    //     );
    //   }
    // });
  }
  getCurrUserInfo(fn) {
    AsyncStorage.getItem("usersInfo").then(res => {
      if (res) {
        let data = JSON.parse(res);
        if (!Array.isArray(data)) {
          data = [];
        }
        if (data.length === 0) {
          //用户列表为空时
          this.replaceCurrRoute("Login");
        }
        let item = data.find(fn);
        if (item) {
          if (!item.password) {
            //没密码调到用户列表
            this.replaceCurrRoute("UserList");
          } else {
            let icon = item.icon;
            if (icon.indexOf("asset") === -1 && icon.indexOf("com") === -1) {
              icon = ResourcePath + icon;
            }
            this.mobile = item.userid;
            this.pwd = item.password;
            this.setState({
              mobile: item.name || this.mobile,
              icon: { uri: icon }
            });
          }
        } else {
          this.replaceCurrRoute("Login");
        }
      } else {
        this.replaceCurrRoute("Login");
      }
    });
  }
  componentWillUnmount() {
    this.isMount = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  shouldComponentUpdate() {
    if (this.isMount) {
      return false;
    }
    return true;
  }
  doLogin() {
    if (!this.mobile || !this.pwd) {
      utility.Toast("登录过期,请重新登录");
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.replaceCurrRoute("Login");
      }, 1000);
      return;
    }
    this.loading && this.loading.show();
    auth.doLogin(this.mobile, this.pwd).then(
      res => {
        if (res) {
          let code = res.code;
          let msg = res.msg;
          if (code === 200) {
            this.replaceCurrRoute("Home");
          }
          if (code === 500) {
            utility.Toast(msg);
            this.timer = setTimeout(() => {
              this.props.navigation.navigate("Login");
            }, 1000);
          }
        }
        this.loading && this.loading.hide();
      },
      err => {
        this.loading && this.loading.hide();
      }
    );
  }
  replaceCurrRoute(routeName) {
    let key = this.navigation.state.key;
    let replceAction = NavigationActions.replace({
      key: key,
      routeName: routeName
    });
    this.navigation.dispatch(replceAction);
  }
  changeAccount() {
    this.props.navigation.navigate("UserList");
  }
  render() {
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/login-background.png")}
          resizeMode={Image.resizeMode.cover}
          style={{ width: "100%", height: "100%" }}
        >
          <Image
            source={require("../../assets/images/shanjixing.png")}
            style={styles.image}
          />
          <View style={styles.container}>
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,.2)"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View>
                  <View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 150,
                          overflow: "hidden"
                        }}
                      >
                        <Image
                          source={this.state.icon}
                          style={{
                            width: 150,
                            height: 150
                          }}
                          defaultSource={{
                            uri: "asset:/userAvatar/default.png"
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 16
                        }}
                        numberOfLines={1}
                      >
                        {this.state.mobile}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonGroup}>
                    <Button
                      primary
                      style={styles.loginBtn}
                      onPress={this.doLogin}
                    >
                      <Text>登陆</Text>
                    </Button>
                  </View>
                </View>
                <View style={{ alignSelf: "flex-end" }}>
                  <Button
                    light
                    small
                    style={{
                      marginLeft: 10,
                      backgroundColor: "transparent",
                      elevation: 0,
                      alignSelf: "flex-end"
                    }}
                    onPress={this.changeAccount}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14
                      }}
                    >
                      切换账号
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
        <Loading
          ref={ref => {
            this.loading = ref;
          }}
          title="登录中..."
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.1)"
  },
  image: {
    position: "absolute",
    top: 5,
    left: 5,
    width: "15%",
    height: "10%"
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
    height: 50
  },
  loginBtn: {
    width: 260,
    paddingVertical: 10,
    alignSelf: "flex-end",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: globalStyle.color.primary
  }
});
