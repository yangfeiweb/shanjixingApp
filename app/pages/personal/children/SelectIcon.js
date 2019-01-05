/**
 * 挑选本地头像
 */
import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { Button } from "native-base";
import IconItem from "./IconItem";
import { IMAGE_PATH, IMG_TYPE, EVENT } from "../../../utility/dict";
import { utility } from "../../../utility";
import globalStyle from "../../../globalStyle";

export default class extends Component {
  constructor(props) {
    super(props);
    this.Icons = [];
    for (let i = 1; i < 151; i++) {
      this.Icons.push(IMAGE_PATH + i + IMG_TYPE);
    }
    this.state = {
      iconSrc: ""
    };
    this.isSelected = false;
    this.selectIcon = this.selectIcon.bind(this);
  }
  componentDidMount() {
    utility.getCurrUserInfo().then(item => {
      if (item) {
        this.setState({
          iconSrc: item.icon || ""
        });
      }
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.iconSrc !== this.state.iconSrc;
  }
  selectIcon(src) {
    this.isSelected = true;
    this.setState({
      iconSrc: src
    });
  }
  saveIcon() {
    if (!this.isSelected) {
      utility.Toast("请选择一张头像");
      return;
    }
    const { Loading, hide } = this.props;
    Loading && Loading.show();
    utility.getCurrUserInfo().then(item => {
      if (item) {
        item.icon = this.state.iconSrc;
        AsyncStorage.setItem("currUser", JSON.stringify(item)).then(res => {
          DeviceEventEmitter.emit(EVENT.CHANGE_ICON);
        });
      }
    });
    utility.getUsersInfo().then(
      res => {
        let data = res.currUserInfo;
        let usersInfo = res.usersInfo;
        if (data) {
          let index = usersInfo.findIndex(
            item => item.studentNo === data.studentNo
          );
          if (index !== -1) {
            data.icon = this.state.iconSrc;
            usersInfo.splice(index, 1, data);
            AsyncStorage.setItem("usersInfo", JSON.stringify(usersInfo)).then(
              res => {
                hide && hide();

                utility.Toast("修改成功");
                Loading && Loading.hide();
              },
              err => {
                Loading && Loading.hide();
                utility.Toast("头像保存失败,请稍后重试");
              }
            );
          }
        }
      },
      err => {
        utility.Toast("头像保存失败,请稍后重试");
        Loading && Loading.hide();
      }
    );
  }
  render() {
    const btn = {
      width: 150,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderColor: globalStyle.color.primary,
      borderRadius: 10
    };
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            paddingBottom: 50
          }}
        >
          {this.Icons.map((item, index) => (
            <IconItem
              key={index}
              src={item}
              isSelected={this.state.iconSrc === item}
              onPress={this.selectIcon}
            />
          ))}
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            flexDirection: "row",
            paddingVertical: 10,
            justifyContent: "space-around",
            backgroundColor: "#fff",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
          }}
        >
          <Button
            bordered
            style={btn}
            onPress={() => {
              this.props.hide && this.props.hide();
            }}
          >
            <Text>取消</Text>
          </Button>
          <Button
            primary
            style={[btn, { backgroundColor: globalStyle.color.primary }]}
            onPress={() => {
              this.saveIcon();
            }}
          >
            <Text style={{ color: "#fff" }}>确认</Text>
          </Button>
        </View>
      </View>
    );
  }
}
