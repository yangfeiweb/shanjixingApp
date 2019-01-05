import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Animated
} from "react-native";
import { NavigationActions } from "react-navigation";
import { Container, Content, Text } from "native-base";
import FAIcons from "react-native-vector-icons/FontAwesome"; //remove
import Icons from "react-native-vector-icons/Ionicons"; //ios-add-circle-outline
import globalStyle from "../../globalStyle";
import { auth } from "../../controller";
import { ResourcePath } from "../../services/urlConfig";
import { Loading, Header } from "../../components";
import { utility } from "../../utility";
export default class extends Component {
  constructor(props) {
    super(props);
    this.opacity = 0;
    this.loading = null;
    this.timer = null;
    this.isUnMount = false;
    this._renderList = this._renderList.bind(this);
    this.showRemoveIcon = this.showRemoveIcon.bind(this);
  }
  state = {
    userList: [],
    opacity: new Animated.Value(0),
    editerText: "编辑"
  };
  componentDidMount() {
    this.loading.show();
    AsyncStorage.getItem("usersInfo")
      .then(res => {
        this.loading&&this.loading.hide();
        if (!res) {
          this.jumpLogin("Login");
        } else {
          let data = JSON.parse(res);
          let infos = [];
          data.forEach(item => {
            if (item) {
              let obj = Object.assign({}, item);
              let icon = obj.icon;
              if (icon.indexOf("asset") === -1 && icon.indexOf("com") === -1) {
                icon = ResourcePath + icon;
              }
              obj.icon = icon;
              infos.push(obj);
            }
          });
          if (infos.length === 0) {
            this.jumpLogin("Login");
          }
          infos.push({ mobile: "add" });
          this.setState({ userList: infos });
        }
      })
      .catch(err => {
        this.loading&&this.loading.hide();
        this.jumpLogin("Login");
      });
  }
  componentWillUnmount() {
    this.isUnMount = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  shouldComponentUpdate() {
    if (this.isUnMount) {
      return false;
    }
    return true;
  }
  jumpLogin(name) {
    const { dispatch } = this.props.navigation;
    let replace = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: name })]
    });
    dispatch(replace);
  }
  login(item) {
    if (!item.userid) {
      utility.Toast("登录过期,请重新登录");
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.jumpLogin("Login");
      }, 1000);
      return;
    }
    if (!item.password) {
      AsyncStorage.setItem("userid", item.userid).then(res => {
        this.props.navigation.navigate("Login");
      });
      return;
    }
    this.loading && this.loading.show();
    auth.doLogin(item.userid, item.password).then(
      res => {
        let code = res.code;
        let msg = res.msg;
        if (code === 200) {
          this.jumpLogin("Home");
        }
        if (code === 500) {
          utility.Toast(msg);
          this.timer = setTimeout(() => {
            this.props.navigation.navigate("Login");
          }, 1000);
        }
        this.loading && this.loading.hide();
      },
      err => {
        this.loading && this.loading.hide();
      }
    );
  }
  remove(item) {
    if (this.opacity !== 0 && item) {
      this.loading.show();
      AsyncStorage.getItem("usersInfo").then(
        res => {
          if (res) {
            let usersInfo = JSON.parse(res);
            let index = usersInfo.findIndex(
              users => users.studentNo === item.studentNo
            );
            if (index !== -1) {
              usersInfo.splice(index, 1);
              AsyncStorage.setItem("usersInfo", JSON.stringify(usersInfo)).then(
                res => {},
                err => {}
              );
              if (usersInfo.length === 0) {
                this.jumpLogin("Login");
              }
              usersInfo.push({ mobile: "add" });
              this.setState({
                userList: usersInfo
              });
            }
            this.loading && this.loading.hide();
          }
        },
        err => {
          utility.Toast("删除失败,请稍后重试");
          this.loading && this.loading.hide();
        }
      );
    }
  }
  showRemoveIcon() {
    if (this.opacity === 0) {
      this.opacity = 1;
      this.opacityAnimatd(1);
      this.setState({
        editerText: "取消"
      });
    } else {
      this.opacityAnimatd(0);
      this.opacity = 0;
      this.setState({
        editerText: "编辑"
      });
    }
  }
  opacityAnimatd(Value) {
    Animated.timing(this.state.opacity, {
      toValue: Value,
      duration: 200,
      useNativeDriver: true
    }).start();
  }
  _renderList(item, index) {
    let component = null;
    if (item.mobile !== "add") {
      // if (!item.mobile) {
      //   return null;
      // }
      component = (
        <View style={styles.itemBox} key={index}>
          <Animated.View
            style={[{ opacity: this.state.opacity }, styles.removeIcon]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.remove(item);
              }}
            >
              <FAIcons
                name="remove"
                color={globalStyle.color.danger}
                size={30}
              />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={styles.headContainer}
            activeOpacity={1}
            onPress={() => {
              this.login(item);
            }}
          >
            <Image
              source={{ uri: item.icon }}
              style={{ width: 100, height: 100 }}
              defaultSource={{ uri: "asset:/userAvatar/default.png" }}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 5 }} numberOfLines={1}>
            {item.name || item.userid || "未绑定手机号"}
          </Text>
        </View>
      );
    } else {
      component = (
        <View style={styles.itemBox} key={index} activeOpacity={1}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate({
                routeName: "Login",
                params: {
                  clear: true
                }
              });
            }}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Icons
              name="ios-add-circle-outline"
              size={115}
              color={globalStyle.color.primary}
            />
          </TouchableOpacity>
          <Text style={{}}>添加新用户</Text>
        </View>
      );
    }
    return component;
  }
  render() {
    return (
      <Container>
        <ImageBackground
          source={require("../../assets/images/login-background.png")}
          resizeMode={Image.resizeMode.cover}
          style={{ width: "100%", height: "100%" }}
        >
          <Image
            source={require("../../assets/images/shanjixing.png")}
            style={styles.image}
          />
          <Header title="账户列表" transparent>
            <View slot="right" style={{ flex: 1 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.showRemoveIcon}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 20
                }}
              >
                <Text>{this.state.editerText}</Text>
              </TouchableOpacity>
            </View>
          </Header>
          <View style={styles.container}>
            <View style={styles.scrollBox}>
              <Content
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}
              >
                {this.state.userList.map(this._renderList)}
              </Content>
            </View>
          </View>
        </ImageBackground>
        <Loading
          ref={ref => {
            this.loading = ref;
          }}
          title="   "
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  removeIcon: {
    position: "absolute",
    top: 5,
    right: 5
  },
  scrollBox: {
    width: "100%",
    height: 200,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    position: "absolute",
    top: 5,
    left: 5,
    width: "15%",
    height: "10%"
  },
  content: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  itemBox: {
    width: 150,
    height: 150,
    marginLeft: 20,
    // backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  headContainer: {
    width: 100,
    height: 100,
    marginVertical: 4,
    overflow: "hidden",
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#5ABEFF",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 4
  }
});
