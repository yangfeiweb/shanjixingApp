import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import commonStyle from "../globalStyle";

import dataService from "../services";
import { utility } from "../utility";
import { syncController } from "../controller";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      syncIconRotate: new Animated.Value(0)
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("studentNo").then(studentNo => {
      this.studentNo = studentNo;
    });
  }
  componentWillUnmount() {
    this.animater && this.animater.stop();
    this.hideTimer && clearTimeout(this.hideTimer);
  }
  syncBookInfo(bookNo) {
    syncController.syncLocalBookToCloud(this.studentNo, bookNo, "DEFAULT");
  }
  startSync() {
    this.setState(
      {
        showSync: true
      },
      () => {
        this.beginAnimate();
        this.setState({
          syncType: "books"
        });
        syncController
          .syncAllBookToCloud(this.studentNo)
          .then(
            () => {
              this.setState({
                syncType: "records"
              });
              syncController.syncLearnRecordToCloud(this.studentNo).then(
                () => {
                  this.setState({
                    syncType: "exams"
                  });
                  syncController.syncLearnExamToCloud(this.studentNo).then(
                    () => {
                      this.animater && this.animater.stop();
                      this.setState({
                        syncType: "success"
                      });
                      this.hideSync();
                    },
                    err => {
                      this.setState({
                        syncType: "examError"
                      });
                      this.hideSync();
                    }
                  );
                },
                err => {
                  this.setState({
                    syncType: "recordError"
                  });
                  this.hideSync();
                }
              );
            },
            err => {
              this.setState({
                syncType: "bookError"
              });
              this.hideSync();
            }
          )
          .catch(e => {
            this.setState({
              syncType: "bookError"
            });
            this.hideSync();
          });
      }
    );
  }
  hideSync() {
    this.hideTimer = setTimeout(() => {
      this.setState({
        showSync: false
      });
    }, 2000);
  }
  beginAnimate() {
    let TIMES = 2000;
    this.animater = Animated.timing(this.state.syncIconRotate, {
      toValue: 360 * TIMES,
      duration: 800 * TIMES,
      useNativeDriver: true,
      easing: Easing.linear
    });
    this.animater.start();
  }
  getSyncText() {
    let text = "";
    switch (this.state.syncType) {
      case "books":
        text = "课本记录同步中...";
        break;
      case "records":
        text = "学习记录同步中...";
        break;
      case "exams":
        text = "试卷记录同步中...";
        break;
      case "bookError":
        text = "同步课本记录失败！";
        break;
      case "recordError":
        text = "同步学习记录失败！";
        break;
      case "examError":
        text = "同步试卷失败！";
        break;
      case "success":
        text = "同步已完成！";
        break;
      default:
        text = "课本记录同步中...";
    }
    return text;
  }
  render() {
    return (
      <View
        style={[
          styles.syncView,
          {
            display: this.state.showSync ? "flex" : "none"
          }
        ]}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: this.state.syncIconRotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"]
                })
              }
            ]
          }}
        >
          <Icon name="ios-sync" style={styles.syncIcon} />
        </Animated.View>
        <Text style={styles.syncText}>{this.getSyncText()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  syncView: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  syncIcon: {
    fontSize: 30,
    color: "#fff"
  },
  syncText: {
    color: "#fff",
    // color: commonStyle.color.warning,
    marginLeft: 10,
    marginRight: 10
  }
});
