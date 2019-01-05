import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ART,
  TouchableOpacity
} from "react-native";

import { Button, Radio } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import commonStyle from "../../../globalStyle";

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";

const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playTimes: 1
    };
  }
  show() {
    this.refs.popDialog.show();
  }
  renderTimesRadio() {
    let timesLen = 5;
    let timesArr = [];
    for (let i = 0; i < timesLen; i++) {
      timesArr.push({ times: i + 1 });
    }
    return timesArr.map(item => {
      return (
        <TouchableOpacity
          key={item.times}
          style={styles.timesItem}
          onPress={() => {
            this.setState({
              playTimes: item.times
            });
          }}
        >
          <Radio
            style={{ marginRight: 5 }}
            selected={this.state.playTimes === item.times}
            onPress={() => {
              this.setState({
                playTimes: item.times
              });
            }}
          />
          <Text>播放 {item.times} 次</Text>
        </TouchableOpacity>
      );
    });
  }
  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={400}
        height={260}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="快速预览"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <Text style={{ alignSelf: "center", marginBottom: 10 }}>
            选择音频播放次数
          </Text>
          <View style={styles.timesInfos}>{this.renderTimesRadio()}</View>
          <View style={styles.dialogBtns}>
            <Button
              rounded
              info
              style={styles.playBtn}
              //   iconLeft
              onPress={() => {
                this.props.onPlay && this.props.onPlay(this.state.playTimes);
                this.refs.popDialog.dismiss();
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>开始预览</Text>
              <Icon
                name="play-circle"
                style={{ color: "#fff", fontSize: 24, marginLeft: 10 }}
              />
            </Button>
          </View>
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  dialogBody: {
    padding: 10,
    flex: 1
  },
  timesInfos: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1
  },
  dialogBtns: {
    height: 60,
    justifyContent: "center"
  },
  playBtn: {
    height: 50,
    width: 200,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  timesItem: {
    flexDirection: "row",
    width: 120,
    padding: 10,
    marginBottom: 10
  }
});
