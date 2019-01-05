import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { Tabs, Tab, Content, ScrollableTab } from "native-base";
import Title from "./children/Title";
import SelectIcon from "./children/SelectIcon";
import UploadIcon from "./children/UploadIcon";
import IconTabBar from "./children/IconTabBar";
import { IMAGE_PATH, IMG_TYPE, EVENT } from "../../utility/dict";
import { utility } from "../../utility";
import globalStyle from "../../globalStyle";
const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });
export default class extends Component {
  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
  }
  componentDidMount() {}
  show() {
    this.refs.PopupDialog && this.refs.PopupDialog.show();
  }
  hide() {
    this.refs.PopupDialog && this.refs.PopupDialog.dismiss();
  }

  render() {
    const { Loading } = this.props;
    return (
      <PopupDialog
        ref="PopupDialog"
        dialogAnimation={slideAnimation}
        width={0.75}
        height={0.7}
        // dismissOnTouchOutside={false}
      >
        <ScrollableTabView
          locked
          tabBarUnderlineStyle={{
            height: 0,
            borderWidth: 0,
            borderColor: "transparent"
          }}
          renderTabBar={() => <IconTabBar />}
        >
          <SelectIcon
            tabLabel="挑选本地头像"
            Loading={Loading}
            hide={this.hide}
          />
          <UploadIcon tabLabel="上传头像" Loading={Loading} hide={this.hide} />
        </ScrollableTabView>
      </PopupDialog>
    );
  }
}
