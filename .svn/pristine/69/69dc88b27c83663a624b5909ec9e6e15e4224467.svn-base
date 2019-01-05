/**
 * 上传头像
 */

import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { Button } from "native-base";
import DeviceInfo from "react-native-device-info";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "react-native-fetch-blob";
import { utility, getRequestSign } from "../../../utility";
import { EVENT } from "../../../utility/dict";
import globalStyle from "../../../globalStyle";
import reqUrl, { ResourcePath } from "../../../services/urlConfig";

export default class extends Component {
  constructor(props) {
    super(props);
    this.imageOptions = {
      cropping: true,
      width: 300,
      height: 300,
      includeBase64: true,
      cropperToolbarTitle: "头像裁剪",
      cropperCircleOverlay: true,
      maxFiles: 1,
      mediaType: "photo",
      compressImageQuality: 0.9,
      showCropGuidelines: false,
      hideBottomControls: true,
      enableRotationGesture: true
    };
    this.token = "";
    this.upLoad = this.upLoad.bind(this);
  }
  componentDidMount() {
    AsyncStorage.getItem("token").then(token => {
      if (token) {
        this.token = token;
      }
    });
  }
  openCamera() {
    //拍照
    ImagePicker.openCamera(this.imageOptions).then(
      image => {
        this.upLoad(image.path);
      },
      err => {
        utility.Toast("取消了拍照");
      }
    );
  }
  openPicker() {
    //打开相册
    ImagePicker.openPicker(this.imageOptions).then(
      image => {
        this.upLoad(image.path);
      },
      err => {
        utility.Toast("取消了选择照片");
      }
    );
  }
  upLoad(path) {
    path = path.replace("file:///", "");
    const { Loading, hide } = this.props;
    Loading && Loading.show();
    let params = {
      token: this.token,
      ts: utility.getTs(),
      version: "1.0.0"
    };
    params["sign"] = getRequestSign(params);
    let body = [];
    for (let key in params) {
      body.push({
        name: key,
        data: params[key]
      });
    }
    body.push({
      name: "file",
      filename: "file.jpeg",
      data: RNFetchBlob.wrap(path)
    });
    RNFetchBlob.fetch(
      "POST",
      reqUrl.CHANGE_ICON,
      {
        Authorization: this.token,
        "Content-Type": "multipart/form-data",
        "User-Agent": DeviceInfo.getUserAgent()
      },
      body
    ).then(
      res => {
        Loading && Loading.hide();
        let result = JSON.parse(res.text());
        let code = result.code;
        let msg = result.msg;
        if (code === 200) {
          utility.Toast("上传成功");
          let icon = result.data.icon;
          icon = ResourcePath + icon;
          Loading && Loading.show();
          utility.getCurrUserInfo().then(item => {
            if (item) {
              item.icon = icon;
              AsyncStorage.setItem("currUser", JSON.stringify(item)).then(
                res => {
                  DeviceEventEmitter.emit(EVENT.CHANGE_ICON);
                }
              );
            }
          });
          utility.getUsersInfo().then(
            res => {
              if (res) {
                let currUserInfo = res.currUserInfo;
                let usersInfo = res.usersInfo;
                let index = usersInfo.findIndex(
                  item => item.studentNo === usersInfo.studentNo
                );
                currUserInfo.icon = icon;
                usersInfo.splice(index, 1, currUserInfo);
                AsyncStorage.setItem(
                  "usersInfo",
                  JSON.stringify(usersInfo)
                ).then(
                  res => {
                    Loading && Loading.hide();
                  },
                  err => {
                    Loading && Loading.hide();
                    utility.Toast("本地存储失败,请退出重新登录");
                  }
                );
              }
            },
            err => {
              Loading && Loading.hide();
              utility.Toast("本地存储失败,请退出重新登录");
            }
          );
        } else if (code === 401) {
        } else if (code === 402) {
          utility.Toast("账号在其他地方登陆！");
          DeviceEventEmitter.emit("gotoLogin");
        } else if (code === 500) {
          utility.Toast(msg);
        }
      },
      err => {
        Loading && Loading.hide();
        utility.Toast("上传失败,请稍后重试");
      }
    );
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 200, justifyContent: "center" }}>
          <Button
            block
            primary
            onPress={this.openCamera.bind(this)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>拍照</Text>
          </Button>
          <Button
            block
            primary
            style={[{ marginTop: 20 }, styles.button]}
            onPress={this.openPicker.bind(this)}
          >
            <Text style={styles.buttonText}>相册</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: globalStyle.color.primary,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 18,
    color: "#fff"
  }
});
