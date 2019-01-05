import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

import { Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import commonStyle from "../../../globalStyle";

import PopupDialog, {
  DialogTitle,
  SlideAnimation
} from "react-native-popup-dialog";

const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      learned: false
    };
  }
  show(learned) {
    if (learned) {
      this.setState({
        learned: true
      });
    }
    this.refs.popDialog.show();
  }
  hide() {
    this.refs.popDialog.dismiss();
  }
  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={350}
        height={220}
        dismissOnTouchOutside={false}
        dismissOnHardwareBackPress={false}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="复习提示"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <Text style={styles.descText}>
            {this.state.learned
              ? "恭喜您，今天的复习已完成！"
              : "今天暂无复习内容。"}
          </Text>
          <Text style={styles.descText}>系统已自动安排复习，请继续保持！</Text>
          <View style={styles.dialogBtns}>
            <Button
              light
              style={[styles.btn]}
              onPress={() => {
                this.refs.popDialog.dismiss();
                this.props.onReturn && this.props.onReturn();
              }}
            >
              <Text style={styles.btnText}>返回我的课程</Text>
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
    lineHeight: 30,
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10
  },
  dialogBtns: {
    position: "absolute",
    bottom: 10,
    width: 350,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  btn: {
    width: 150,
    height: 50,
    borderRadius: 10,
    justifyContent: "center"
  },
  btnText: {
    fontSize: 18
  }
});
