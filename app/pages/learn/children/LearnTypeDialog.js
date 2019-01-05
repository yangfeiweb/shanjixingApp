import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {
  Content,
  ListItem,
  Body,
  Text,
  CheckBox,
  Left,
  Right,
  List,
  Button,
  Radio
} from "native-base";
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";
import { ProgressBar } from "../../../components";
import commonStyle from "../../../globalStyle";
import { LEARN_TYPE } from "../../../utility/dict";
const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

export default class extends Component {
  constructor(props) {
    super(props);
    this.items = [
      {
        name: "认读课程",
        color: commonStyle.color.primary,
        type: LEARN_TYPE.DEFAULT
      },
      {
        name: "辩音课程",
        color: commonStyle.color.success,
        type: LEARN_TYPE.LISTEN
      },
      {
        name: "拼写课程",
        color: commonStyle.color.lightRed,
        type: LEARN_TYPE.SPELL
      }
    ];
    this.state = {
      learnType: LEARN_TYPE.DEFAULT
    };
  }
  show() {
    this.refs.popDialog && this.refs.popDialog.show();
  }
  hide() {
    this.refs.popDialog && this.refs.popDialog.dismiss();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.data !== this.props.data ||
      nextState.learnType !== this.state.learnType
    );
  }
  componentDidUpdate() {
  }
  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={450}
        height={310}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="请选择学习类型"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <List style={{ flex: 1 }}>
          {this.items.map((item, index) => (
            <ListItem
              key={index}
              style={{ justifyContent: "space-around" }}
              onPress={() => {
                this.setState({
                  learnType: item.type
                });
              }}
            >
              <Radio selected={item.type === this.state.learnType} />
              <Text>{item.name}</Text>
              <View style={{ width: "60%" }}>
                <ProgressBar progress={0} />
              </View>
            </ListItem>
          ))}
        </List>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 10
          }}
        >
          <Button
            style={[
              styles.btn,
              { backgroundColor: commonStyle.color.lightRed }
            ]}
            onPress={() => {
              this.hide();
            }}
          >
            <Text style={{ color: commonStyle.color.primary }}>取消</Text>
          </Button>
          <Button
            style={[styles.btn, { backgroundColor: commonStyle.color.primary }]}
          >
            <Text>确定</Text>
          </Button>
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    width: 100,
    height: 40,
    borderRadius: 10,
    justifyContent: "center"
  }
});
