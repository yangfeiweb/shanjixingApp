import React from "react";
import {
  AsyncStorage,
  View,
  Text,
  Alert,
  NativeModules,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid
} from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import dismissKeyboard from "react-native-dismiss-keyboard";
import { NavigationActions } from "react-navigation";
import globalStyle from "../../globalStyle/index";
import { Header, Loading } from "../../components";
import EmailRegistry from "./children/EmailRegistry";
import PhoneRegistry from "./children/PhoneRegistry";
import RegistryTabBar from "./children/RegistryTabBar";
import dataService from "../../services";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.Loading = null;
    this.scrollView = null;
    this.tabIndex = 0;
    this.EmailRegistry = null;
    this.PhoneRegistry = null;
  }
  componentDidMount() {
    this.setState({ Loading: this.Loading });
  }
  state = {
    offsetTop: 0,
    Loading: null
  };

  registryButton() {
    //确定注册按钮
    if (this.tabIndex === 0) {
      this.PhoneRegistry.registerPhone();
    } else if (this.tabIndex === 1) {
      this.EmailRegistry.registerEmail();
    }
  }
  //手机号注册之后登陆成功后跳转到Home
  registerAfter(isMoile) {
    if (isMoile) {
      let action = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Home" })]
      });
      this.props.navigation.dispatch(action);
    } else {
      this.props.navigation.goBack();
    }
  }
  onChangeTab(key) {
    this.tabIndex = key.i;
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
        <View style={[styles.whiteBlack]} />
        <TouchableHighlight
          underlayColor="transparent"
          style={{ flex: 1 }}
          onPress={dismissKeyboard}
          activeOpacity={1}
        >
          <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            ref={ref => {
              this.scrollView = ref;
            }}
            keyboardShouldPersistTaps="always"
          >
            <View>
              <Header transparent={true} title="注册" />
            </View>
            <View style={{ marginTop: "7%", alignItems: "center" }}>
              <View style={{ height: 300 }}>
                <ScrollableTabView
                  onChangeTab={this.onChangeTab.bind(this)}
                  locked
                  renderTabBar={() => <RegistryTabBar />}
                  style={{ width: "60%" }}
                  scrollWithoutAnimation={true}
                  tabBarUnderlineStyle={{ opacity: 0, height: 0 }}
                >
                  <PhoneRegistry
                    Loading={this.state.Loading}
                    registerAfter={this.registerAfter.bind(this)}
                    tabLabel="手机号注册"
                    ref={ref => {
                      this.PhoneRegistry = ref;
                    }}
                  />
                  <EmailRegistry
                    Loading={this.state.Loading}
                    registerAfter={this.registerAfter.bind(this)}
                    tabLabel="邮箱注册"
                    ref={ref => {
                      this.EmailRegistry = ref;
                    }}
                  />
                </ScrollableTabView>
              </View>
              <View style={styles.registryBtnBox}>
                <TouchableOpacity
                  style={styles.registryBtn}
                  onPress={this.registryButton.bind(this)}
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
          title="   "
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
  registryBtnBox: {
    width: "100%",
    alignItems: "center"
  },
  registryBtn: {
    width: "60%",
    height: 60,
    backgroundColor: globalStyle.color.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  textColor: {
    color: "#ffffff"
  }
});
