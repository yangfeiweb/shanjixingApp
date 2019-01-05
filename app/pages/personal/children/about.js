import React from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Button } from "native-base";
import commonStyle from "../../../globalStyle";
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";
import { getVersion } from "react-native-device-info";
import dataService from "../../../services";

const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

export class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "",
      versionData: "",
      isUpDate: false
    };
  }
  componentDidMount() {
    // 获取当前版本号
    let newVersion = getVersion();
    this.setState({ version: newVersion });
    //查询是否有最新版本
    dataService.checkAppVersion().then(res => {
      let data = res.data;
      if (data) {
        let needUpdate = data.needUpdate;
        if (needUpdate === "Y") {
          let versionData = data.version;
          this.setState({ isUpDate: true });
          this.setState({
            versionData: versionData
          });
        }
      }
    });
  }
  show() {
    this.refs.popDialog.show();
  }
  versionUp() {
    if (this.state.isUpDate) {
      return (
        <View>
          <Text style={styles.introText}>
            版本号：
            <Text style={{ color: "#56BDFF" }}>{this.state.version}</Text>
            （版本有更新）
          </Text>
          <View
            style={{
              width: "100%",
              height: 70,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                width: 200,
                height: 50,
                borderRadius: 10,
                justifyContent: "center",
                backgroundColor: commonStyle.color.primary
              }}
              onPress={() => {
                this.refs.popDialog.dismiss();
                this.props.downLoadShow();
              }}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>去更新</Text>
            </Button>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.introText}>
            版本号：
            <Text style={{ color: "#56BDFF" }}>{this.state.version}</Text>
            （已是最新版本）
          </Text>
          <View
            style={{
              width: "100%",
              height: 70,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                width: 200,
                height: 50,
                borderRadius: 10,
                justifyContent: "center",
                backgroundColor: commonStyle.color.primary
              }}
              onPress={() => {
                this.refs.popDialog.dismiss();
              }}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>确定</Text>
            </Button>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <PopupDialog
        width={500}
        height={340}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="闪记星简介 "
          />
        }
        dialogAnimation={slideAnimation}
        ref="popDialog"
      >
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            闪记星是一款速记软件，拥有快速记忆的特点。闪记星会自动分析用户的学习行为，结合科学的记忆方法，为每个用户规划出一套私有的学习计划，通过科学的计划和简单的重复记忆，达到快速记忆的效果。
          </Text>
          {this.versionUp()}
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  introContainer: {
    padding: 10
  },
  introText: {
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 26
  }
});
