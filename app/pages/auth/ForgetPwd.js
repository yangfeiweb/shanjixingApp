import React from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  NativeModules,
  TouchableHighlight,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FdIcons from "react-native-vector-icons/Foundation";
import dismissKeyboard from "react-native-dismiss-keyboard";
import { utility } from "../../utility";
import globalStyle from "../../globalStyle";
import { Header, Loading } from "../../components";
import dataServices from "../../services";
const { width, height } = Dimensions.get("window");
const userSize = 100;
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.isMobile = false; //用户输入的是邮箱还是手机号
    this.captchaKey = null; //发送验证后返回的key 值
    this.captchaCode = null; //用户输入的验证吗
    this.userName = null; //用户名
    this.userPwd = null; //用户第一次输入的密码
    this.userPwdAgain = null; //用户第二次输入的密码
    this.captchaType = null; //发送验证码的类型 是邮箱还是手机号
    this.scrollView = null;
    this.Loading = null;
  }
  state = {
    timeText: "获取验证码",
    disableCaptchaBtn: false,
    offsetTop: 0
  };

  componentDidMount() {}

  doSubmit() {
    //确定提交
    if (!this.userName) {
      utility.Toast("请输入绑定的手机号或者邮箱");
      return;
    }
    if (!this.captchaKey) {
      utility.Toast("未获取验证码");
      return;
    }
    if (!this.captchaCode) {
      utility.Toast("请输入验证码");
      return;
    }
    if (!this.userPwd) {
      utility.Toast("请输入密码");
      return;
    }
    if (!this.userPwdAlign) {
      utility.Toast("请再次输入密码");
      return;
    }

    if (this.checkPwd() || this.checkPwdAgain()) {
      return;
    }
    this.Loading.show();
    dataServices
      .findPwd(this.userName, this.userPwd, this.captchaCode, this.captchaKey)
      .then(
        res => {
          let code = res.code;
          let msg = res.msg;
          if (code === 200) {
            utility.Toast("密码重置成功");
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 500);
          }
          if (code === 500) {
            utility.Toast(msg);
          }
          this.Loading.hide();
        },
        err => {
          this.Loading.hide();
        }
      );
  }

  getUserName(val) {
    //用户名
    this.userName = val;
  }

  getCaptchaCode(val) {
    //验证码
    this.captchaCode = val;
  }

  getUserPwd(val) {
    //密码
    this.userPwd = val;
    if (!val) {
      this.captchaType = null;
    }
  }

  getUserPwdAgain(val) {
    //第二次输入的密码
    this.userPwdAlign = val;
  }

  checkUserName() {
    if (this.userName) {
      let mobile = /^1\d{10}$/g.test(this.userName);
      let index = this.userName.indexOf("@");
      if (!mobile) {
        if (index === -1) {
          utility.Toast("请确认手机号或者邮箱的输入是否正确");
        } else {
          this.captchaType = "EMAIL_FORGOT_PASSWORD"; //邮箱忘记密码的验证类型
          this.isMobile = false;
        }
      } else {
        this.captchaType = "FORGOT_PASSWORD"; //手机
        this.isMobile = true;
      }
    }
  }
  checkPwd() {
    //检查用户第一次输入的密码
    if (this.userPwd) {
      if (this.userPwd.length < 6) {
        utility.Toast("请至少输入六位密码");
        return true;
      }
      return false;
    }
  }
  checkPwdAgain() {
    if (this.userPwdAlign) {
      if (this.userPwdAlign !== this.userPwd) {
        utility.Toast("两次密码不一致");
        return true;
      }
      return false;
    }
  }
  sendCaptcha() {
    //发送验证码
    this.checkUserName();
    if (!this.captchaType) {
      return;
    }
    this.Loading.show();
    dataServices.sendCaptcha(this.captchaType, this.userName).then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          let data = res.data;
          this.captchaKey = data.captchaKey;
          let tipMsg = this.isMobile
            ? "验证码已发送"
            : "验证码已发送,请前往邮箱查看";
          utility.Toast(tipMsg);
          this.setState({ disableCaptchaBtn: true });
          this.startTimer();
        }
        if (code === 500) {
          utility.Toast(msg);
        }
        this.Loading.hide();
      },
      err => {
        this.Loading.hide();
      }
    );
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
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  _inputOnFocus(event) {
    NativeModules.UIManager.measure(
      event.target,
      (x, y, inputWidth, inputHeight, pageX, pageY) => {
        this.scrollView.scrollTo({
          x: 0,
          y: pageY + inputHeight,
          animated: true
        });
      }
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/registry-background.png")}
          resizeMode={Image.resizeMode.cover}
          style={[styles.ImageBackground, StyleSheet.absoluteFill]}
        />
        <View style={styles.whiteBlack} />
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
              <Header transparent={true} title="忘记密码" />
            </View>
            <View>
              <View style={[styles.container, { paddingTop: 50 }]}>
                <View style={(styles.registryContainer, styles.inputBox)}>
                  <View style={[styles.inputItems, styles.bottomLine]}>
                    <MCIcons name="account" size={20} color="#5ABEFF" />
                    <TextInput
                      style={styles.textInput}
                      onChangeText={this.getUserName.bind(this)}
                      placeholder="请输入手机号"
                      underlineColorAndroid="transparent"
                      maxLength={40}
                      onFocus={this._inputOnFocus.bind(this)}
                    />
                  </View>
                  <View style={[styles.inputItems, styles.bottomLine]}>
                    <FdIcons name="shield" size={20} color="#5ABEFF" />
                    <TextInput
                      style={styles.textInput}
                      onChangeText={this.getCaptchaCode.bind(this)}
                      placeholder="请输入验证码"
                      underlineColorAndroid="transparent"
                      maxLength={6}
                      onFocus={this._inputOnFocus.bind(this)}
                    />
                    <TouchableOpacity
                      style={styles.captcha}
                      onPress={this.sendCaptcha.bind(this)}
                      disabled={this.state.disableCaptchaBtn}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.textColor}>
                        {this.state.timeText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.inputItems, styles.bottomLine]}>
                    <MCIcons name="lock-open" size={20} color="#5ABEFF" />
                    <TextInput
                      onBlur={this.checkPwd.bind(this)}
                      style={styles.textInput}
                      secureTextEntry={true}
                      onChangeText={this.getUserPwd.bind(this)}
                      placeholder="请输入密码"
                      underlineColorAndroid="transparent"
                      maxLength={40}
                      onFocus={this._inputOnFocus.bind(this)}
                    />
                  </View>
                  <View style={styles.inputItems}>
                    <MCIcons name="lock-open" size={20} color="#5ABEFF" />
                    <TextInput
                      onBlur={this.checkPwdAgain.bind(this)}
                      style={styles.textInput}
                      secureTextEntry={true}
                      onChangeText={this.getUserPwdAgain.bind(this)}
                      placeholder="请确认密码"
                      underlineColorAndroid="transparent"
                      maxLength={40}
                      onFocus={this._inputOnFocus.bind(this)}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.registryContainer, { alignSelf: "center" }]}>
                <TouchableOpacity
                  style={styles.registryBtn}
                  onPress={this.doSubmit.bind(this)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.textColor}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableHighlight>
        <Loading
          ref={ref => {
            this.Loading = ref;
          }}
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
  ImageBackground: {
    width: "100%",
    height: "100%"
  },
  whiteBlack: {
    width: "100%",
    height: "50%",
    position: "absolute",
    top: "50%",
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#ffffff"
  },
  userIcon: {
    width: userSize,
    height: userSize,
    borderRadius: userSize,
    marginTop: 30,
    marginBottom: 20,
    overflow: "hidden"
  },
  registryContainer: {
    width: 600
  },
  inputBox: {
    height: 240,
    backgroundColor: "#ffffff",
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#eeddee",
    shadowOffset: { width: 4, height: 4 },
    shadowColor: "#5ABEFF",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 4
  },
  inputItems: {
    height: 55,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textInput: {
    width: 390,
    marginLeft: 20
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#5ABEFF"
  },
  captcha: {
    width: 110,
    height: 40,
    padding: 5,
    backgroundColor: globalStyle.color.primary,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  registryBtn: {
    height: 60,
    backgroundColor: globalStyle.color.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  textColor: {
    color: "#ffffff"
  }
});
