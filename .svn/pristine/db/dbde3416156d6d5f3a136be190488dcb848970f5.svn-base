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
        height={200}
        dismissOnTouchOutside={false}
        dismissOnHardwareBackPress={false}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="学习提示"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <Text style={styles.descText}>是否要进行章节前测试？</Text>
          <View style={styles.dialogBtns}>
            <Button
              style={[
                styles.btn,
                {
                  backgroundColor: commonStyle.color.primary
                }
              ]}
              onPress={() => {
                this.refs.popDialog.dismiss();
                this.props.onOK && this.props.onOK();
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  {
                    color: "#fff"
                  }
                ]}
              >
                是
              </Text>
            </Button>
            <Button
              light
              style={styles.btn}
              onPress={() => {
                this.refs.popDialog.dismiss();
                this.props.onCancel && this.props.onCancel();
              }}
            >
              <Text style={styles.btnText}>否</Text>
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
    lineHeight: 40,
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
