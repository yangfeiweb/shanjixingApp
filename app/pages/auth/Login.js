import React from "react";
import {
  View,
  Text,
  Alert,
  Image,
  Dimensions,
  NativeModules,
  StyleSheet,
  ScrollView,
  Keyboard,
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  AsyncStorage
} from "react-native";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import dismissKeyboard from "react-native-dismiss-keyboard";
import { NavigationActions } from "react-navigation";
import { Header, Loading } from "../../components";
import globalStyle from "../../globalStyle/index";
import { auth } from "../../controller";
import dataService from "../../services";
import { ResourcePath } from "../../services/urlConfig";
import { utility } from "../../utility";
import { IMAGE_PATH, IMG_TYPE } from "../../utility/dict";
const userSize = 100;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.scrollView = null;
    this.userName = null;
    this.userPwd = null;
    this.Loading = null;
    this.state = {
      offsetTop: 0,
      userIcon: { uri: "asset:/userAvatar/default.png" },
      defaultUserName: "",
      defaultPwd: "",
      secureTextEntry: true
    };
    this.studentList = null;
  }
  componentDidMount() {
    AsyncStorage.getItem("currMobile").then(mobile => {
      if (!mobile) {
        this.getCurrinfo("userid", item => {
          //头像
          if (item) {
            this.setDefaultItem(item);
          }
        });
      } else {
        AsyncStorage.getItem("usersInfo").then(res => {
          if (res) {
            let data = JSON.parse(res);
            if (data) {
              let item = data.find(item => item.mobile === mobile);
              if (item) {
                this.setDefaultItem(item);
              }
            }
          }
        });
      }
    });

    // this.getCurrinfo("studentNo", item => {
    //   //自动登录
    //   if (item) {
    //     this.setState({
    //       defaultUserName: item.mobile,
    //       defaultPwd: item.password
    //     });
    //     this.userName = item.mobile;
    //     this.userPwd = item.password;
    //     // this.props.navigation.navigate('Home')
    //     this.doLogin(item.mobile, item.password);
    //   }
    // });
  }
  setDefaultItem(item) {
    let params = this.props.navigation.state.params;
    if (!params || !params.clear) {
      let icon = item.icon || "asset:/userAvatar/default.png";
      if (icon.indexOf("asset") === -1 && icon.indexOf("com") === -1) {
        icon = ResourcePath + icon;
      }
      this.userName = item.userid;
      if (item.password) {
        this.userPwd = item.password;
      }
      this.setState({
        defaultUserName: item.userid,
        defaultPwd: item.password || "",
        userIcon: { uri: icon }
      });
    }
  }
  getCurrinfo(args, callBack) {
    AsyncStorage.getItem(args).then(studentNo => {
      if (studentNo) {
        AsyncStorage.getItem("usersInfo")
          .then(res => {
            if (res) {
              let data = JSON.parse(res);
              let name = args;
              this.studentList = data;
              let item = data.find(item => item[name] === studentNo);
              callBack && callBack(item);
            }
          })
          .catch(err => {});
      }
    });
  }
  doLogin(name, pwd) {
    let userName = name || this.userName;
    let userPwd = pwd || this.userPwd;
    if (!userName) {
      utility.Toast("请输入用户名！");
      return;
    }

    if (!userPwd) {
      utility.Toast("请输入密码！");
      return;
    }
    this.Loading.show();
    //登陆
    auth.doLogin(userName, userPwd).then(
      res => {
        this.Loading.hide();
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          let action = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Home" })]
          });
          this.props.navigation.dispatch(action);
        }
        if (code === 500) {
          utility.Toast(msg);
        }
      },
      err => {
        this.Loading.hide();
      }
    );
  }
  getUserName(val) {
    this.userName = val;
  }

  getUserPwd(val) {
    this.userPwd = val;
  }
  checkUserName() {
    if (!this.userName) {
      return false;
    }
  }
  checkUserPwd() {
    if (this.userPwd && this.userPwd.length < 6) {
      utility.Toast("密码至少为6位!");
    }
  }
  _inputOnFocus(event) {
    NativeModules.UIManager.measure(
      event.target,
      (x, y, inputWidth, inputHeight, pageX, pageY) => {
        // this.setState({ offsetTop: pageY - height + inputHeight })
        this.scrollView.scrollTo({
          x: 0,
          y: pageY + 2 * inputHeight,
          animated: true
        });
      }
    );
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/login-background.png")}
          resizeMode={Image.resizeMode.cover}
          style={styles.ImageBackground}
        />
        <View style={styles.maskPosition} />
        <TouchableHighlight
          underlayColor="transparent"
          style={{ flex: 1 }}
          onPress={dismissKeyboard}
          activeOpacity={1}
        >
          <ScrollView
            style={{ width: "100%" }}
            ref={ref => {
              this.scrollView = ref;
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <View>
              <Header transparent={true} showLeft={false} title="登录">
                <View
                  slot="right"
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "center"
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={8}
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "center",
                      height: "100%",
                      width: 150 * utility.deviceRatio
                    }}
                    onPress={() => {
                      if (!this.studentList) {
                        utility.Toast("未有用户列表信息");
                      } else {
                        this.props.navigation.navigate("UserList");
                      }
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 14,
                        color: "#fff"
                      }}
                    >
                      切换账号
                    </Text>
                  </TouchableOpacity>
                </View>
              </Header>
            </View>
            <View style={styles.container}>
              <View style={styles.userIcon}>
                <Image
                  source={this.state.userIcon}
                  style={{ width: userSize, height: userSize }}
                  defaultSource={{
                    uri: "asset:/userAvatar/default.png",
                    width: 100 * utility.deviceRatio,
                    height: 100 * utility.deviceRatio,
                    scale: 1
                  }}
                />
              </View>
              <View style={styles.loginForm}>
                <View
                  style={[
                    styles.loginFormItems,
                    { borderBottomWidth: 1, borderBottomColor: "#5ABEFF" }
                  ]}
                >
                  <Icons
                    name="account"
                    size={20 * utility.deviceRatio}
                    color="#5ABEFF"
                  />
                  <TextInput
                    style={styles.textInput}
                    onChangeText={this.getUserName.bind(this)}
                    placeholder="请输入用户名/手机号"
                    defaultValue={this.state.defaultUserName}
                    underlineColorAndroid="transparent"
                    maxLength={40}
                    ref="userName"
                    onBlur={this.checkUserName.bind(this)}
                    onFocus={this._inputOnFocus.bind(this)}
                  />
                  <Ionicon.Button
                    name="ios-close-circle"
                    size={20 * utility.deviceRatio}
                    color="#5ABEFF"
                    backgroundColor="transparent"
                    style={{
                      width: 70 * utility.deviceRatio,
                      height: "100%",
                      justifyContent: "center"
                    }}
                    underlayColor="transparent"
                    onPress={() => {
                      this.refs.userName && this.refs.userName.clear();
                    }}
                  />
                </View>
                <View style={styles.loginFormItems}>
                  <Icons
                    name="lock-open"
                    size={20 * utility.deviceRatio}
                    color="#5ABEFF"
                    style={{ fontWeight: "bold" }}
                  />
                  <TextInput
                    secureTextEntry={this.state.secureTextEntry}
                    defaultValue={this.state.defaultPwd}
                    onChangeText={this.getUserPwd.bind(this)}
                    style={styles.textInput}
                    placeholder="请输入密码"
                    underlineColorAndroid="transparent"
                    maxLength={30}
                    ref="userPwd"
                    onBlur={this.checkUserPwd.bind(this)}
                    onFocus={this._inputOnFocus.bind(this)}
                  />
                  <Ionicon.Button
                    name="ios-close-circle"
                    size={20 * utility.deviceRatio}
                    color="#5ABEFF"
                    backgroundColor="transparent"
                    style={{
                      width: 70 * utility.deviceRatio,
                      height: "100%",
                      justifyContent: "center"
                    }}
                    underlayColor="transparent"
                    onPress={() => {
                      this.refs.userPwd && this.refs.userPwd.clear();
                    }}
                  />
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.doLogin();
                  }}
                  style={styles.loginButton}
                  activeOpacity={0.95}
                >
                  <Text style={styles.btnText}>登陆</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.registryAndForgetPwd}>
                <TouchableOpacity
                  style={styles.regBtn}
                  onPress={() => navigate("Registry")}
                  activeOpacity={1}
                >
                  <Text style={styles.btnText}>注册</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.regBtn}
                  onPress={() => navigate("ForgetPwd")}
                  activeOpacity={1}
                >
                  <Text style={styles.btnText}>忘记密码?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableHighlight>
        <Loading
          ref={ref => {
            this.Loading = ref;
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
    justifyContent: "center"
  },
  flexStyleLayout: {
    flex: 1,
    alignItems: "center"
  },
  ImageBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  loginTitleText: {
    fontSize: 14 * utility.deviceRatio,
    color: "#ffffff"
  },
  userIcon: {
    width: userSize,
    height: userSize,
    borderRadius: userSize,
    marginTop: 30 * utility.deviceRatio,
    marginBottom: 20 * utility.deviceRatio,
    overflow: "hidden"
  },
  loginForm: {
    width: 600 * utility.deviceRatio,
    paddingVertical: 10 * utility.deviceRatio,
    paddingHorizontal: 20 * utility.deviceRatio,
    backgroundColor: "#ffffff",
    borderRadius: 20 * utility.deviceRatio,
    borderWidth: 1,
    borderColor: "#eeddee"
  },
  loginFormItems: {
    height: 70 * utility.deviceRatio,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textInput: {
    flex: 1,
    // width: 400,
    marginLeft: 20 * utility.deviceRatio,
    fontSize: 16 * utility.deviceRatio
  },
  loginButton: {
    width: 600 * utility.deviceRatio,
    height: 60 * utility.deviceRatio,
    borderRadius: 10 * utility.deviceRatio,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20 * utility.deviceRatio,
    backgroundColor: globalStyle.color.primary
  },
  btnText: {
    color: "#ffffff",
    fontSize: 14 * utility.deviceRatio
  },
  registryAndForgetPwd: {
    width: 600 * utility.deviceRatio,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10 * utility.deviceRatio
  },
  regBtn: {
    width: 80 * utility.deviceRatio,
    height: 50 * utility.deviceRatio
  },
  maskPosition: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.15)"
  }
});
