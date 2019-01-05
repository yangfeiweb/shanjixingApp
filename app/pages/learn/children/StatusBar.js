import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Button } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
// import Sound from "react-native-sound";
import Icon from "react-native-vector-icons/FontAwesome";
import commonStyle from "../../../globalStyle";

export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  renderStatusInfo() {
    let type = this.props.type;
    let data = this.props.infoData;
    if (this.props.previewing) {
      let previewData = this.props.previewData;
      return (
        <View style={styles.status}>
          <Text style={styles.statusItem}>
            快速预览中...
            <Text>{previewData && previewData.columnName}</Text>
            （{previewData && previewData.columnTotal + " - "}
            <Text style={styles.rightCount}>
              {((previewData && previewData.previwWordIdx) || 0) + 1}
            </Text>）
          </Text>
        </View>
      );
    } else if (type === "learn") {
      return (
        <View style={styles.status}>
          <Text style={styles.statusItem}>
            本组进度（{data.count + " - "}
            <Text style={styles.rightCount}>{data.right}</Text>）
          </Text>
          <Text style={styles.statusItem}>
            生词（<Text style={styles.errCount}>{data.err}</Text>）
          </Text>
          <Text style={styles.statusItem}>
            课程总进度（{data.total + " - " + data.totalRight}）
          </Text>
          <Text style={styles.statusItem}>
            总生词（{data.totalErr}）
          </Text>
        </View>
      );
    } else if (type === "review") {
      return (
        <View style={styles.status}>
          <Text style={{ paddingLeft: 5, color: "#FFC107" }}>
            智能复习中...
          </Text>
          <Text style={styles.statusItem}>
            （{data && data.reviewTotal + " - "}{" "}
          </Text>
          <Text style={styles.rightCount}>{data && data.reivewRightCount}</Text>
          <Text style={styles.statusItem}>）</Text>
        </View>
      );
    }
  }
  render() {
    return <View style={styles.footer}>{this.renderStatusInfo()}</View>;
  }
  componentWillUnmount() {
    this.answerSound && this.answerSound.release();
    this.successSound && this.successSound.release();
    this.errSound && this.errSound.release();
    this.errTimer && clearTimeout(this.errTimer);
    this.rightTimer && clearTimeout(this.rightTimer);
  }
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "rgba(80,80,80,0.8)",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 30,
    flexDirection: "row"
  },
  status: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  statusItem: {
    paddingLeft: 5,
    color: "#fff"
  },
  btnRow: {
    width: 550,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  btn: {
    alignSelf: "center",
    width: 200,
    height: 60,
    marginRight: 20,
    borderRadius: 10,
    justifyContent: "center"
  },
  btnText: {
    color: "#fff",
    fontSize: 22
  },
  btnIcon: {
    marginRight: 5,
    fontSize: 30,
    color: "#fff"
  },
  rightCount: {
    color: commonStyle.color.primary
  },
  errCount: {
    color: commonStyle.color.danger
  }
});
