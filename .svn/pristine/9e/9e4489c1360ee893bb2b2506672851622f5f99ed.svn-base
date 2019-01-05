import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ART,
  TouchableOpacity
} from "react-native";

import { Button } from "native-base";
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
  hide() {
    this.refs.popDialog.dismiss();
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
            title="操作提示 "
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <Text style={styles.descText}>本章节已学习完成！</Text>
          <Text style={styles.descText}>
            如果想重新学习，需要清空原来的学习记录。
          </Text>
          <Text style={styles.descText}>记录清空后将无法安排智能复习！</Text>
          <Text style={[styles.descText, { color: commonStyle.color.danger }]}>
            确定要清空吗？
          </Text>
          <View style={styles.dialogBtns}>
            <Button
              style={[
                styles.btn,
                {
                  backgroundColor: commonStyle.color.primary
                }
              ]}
              onPress={() => {
                this.props.onOkClick && this.props.onOkClick();
              }}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>确定</Text>
            </Button>
            <Button
              light
              style={[styles.btn]}
              onPress={() => {
                this.refs.popDialog.dismiss();
              }}
            >
              <Text style={styles.btnText}>取消</Text>
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
    flex: 1,
    position: "relative"
  },
  descText: {
    lineHeight: 22,
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10
  },
  dialogBtns: {
    position: "absolute",
    bottom: 10,
    width: 400,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  btn: {
    alignSelf: "center",
    width: 160,
    height: 50,
    borderRadius: 10,
    justifyContent: "center"
  },
  btnText: {
    fontSize: 18
  }
});
