import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import commonStyle from "../../../globalStyle";
import { LeftDrawer } from "../../../components";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewing: false
    };
  }
  show() {
    this.refs.drawer.show();
    let currColumnNo = this.props.currColumnNo;
    if (this.props.previewing) {
      currColumnNo = this.props.previewColumnNo;
    }
    let currIdx = this.props.columns.findIndex(item => {
      return item.columnNo === currColumnNo;
    });
    let offsetH = (currIdx - 2) * 80;
    if (offsetH < 0) {
      offsetH = 0;
    }
    this.refs.columnScrollView.scrollTo({ x: 0, y: offsetH, animated: true });
  }
  renderColumnItem() {
    let columns = this.props.columns;
    if (columns) {
      return columns.map((item, idx) => {
        return (
          <TouchableOpacity
            style={[
              styles.columnItem,
              {
                backgroundColor:
                  (this.props.previewing &&
                    item.columnNo === this.props.previewColumnNo) ||
                  (!this.props.previewing &&
                    item.columnNo === this.props.currColumnNo)
                    ? "rgba(86,189,255,0.1)"
                    : "rgba(0,0,0,0)"
              }
            ]}
            key={item.columnNo}
            onPress={() => {
              this.refs.drawer.hide();
              this.props.onColumnPress && this.props.onColumnPress(item);
            }}
          >
            {!this.props.previewing &&
              item.columnNo === this.props.currColumnNo && (
                <Icon name="play-arrow" style={styles.currIcon} />
              )}
            {this.props.previewing &&
              item.columnNo === this.props.previewColumnNo && (
                <Icon
                  name="play-arrow"
                  style={[styles.currIcon, { color: commonStyle.color.danger }]}
                />
              )}
            <Text style={styles.columnItemInfo} numberOfLines={1}>
              {idx + 1}. {item.name}
            </Text>
            {(item.columnNo === this.props.currColumnNo && (
              <Text style={styles.columnItemInfo}>
                条目 {item.words} -{" 已学："}
                <Text style={styles.rightCount}>
                  {this.props.currRightCount}
                </Text>{" "}
                | 错误：
                <Text style={styles.errCount}>{this.props.currErrCount}</Text>
              </Text>
            )) || (
              <Text style={styles.columnItemInfo}>
                条目 {item.words} -{" 已学："}
                <Text style={styles.rightCount}>{item.rightNum}</Text> | 错误：
                <Text style={styles.errCount}>{item.errorNum}</Text>
              </Text>
            )}
            {item.rightNum === item.words && (
              <Icon name="check" style={styles.learnedIcon} />
            )}
          </TouchableOpacity>
        );
      });
    }
  }
  render() {
    return (
      <LeftDrawer
        ref="drawer"
        backgroundColor="rgba(255,255,255,0.9)"
        onHide={() => {
          this.props.onHide && this.props.onHide();
        }}
      >
        <View style={styles.root}>
          <View style={styles.courseTitle}>
            <Text>{this.props.bookName}</Text>
            <Text>（目录）</Text>
          </View>
          <ScrollView ref="columnScrollView" style={styles.columns}>
            {this.renderColumnItem()}
          </ScrollView>
          {/* <TouchableOpacity
            style={styles.previewContent}
            onPress={() => {
              if (this.state.previewing) {
                this.setState({ previewing: false });
              } else {
                // this.refs.timesDialog.show();
                this.props.onPreviewPlay && this.props.onPreviewPlay();
              }
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: this.state.previewing
                  ? commonStyle.color.danger
                  : "#1596d4"
              }}
            >
              {this.state.previewing ? "停止预览" : "快速预览"}
            </Text>
            <Icon
              name={
                this.state.previewing
                  ? "pause-circle-filled"
                  : "play-circle-filled"
              }
              style={{
                fontSize: 30,
                marginLeft: 10,
                color: this.state.previewing
                  ? commonStyle.color.danger
                  : "#1596d4"
              }}
            />
          </TouchableOpacity> */}
        </View>
      </LeftDrawer>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10
  },
  courseTitle: {
    // height: 80,
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: commonStyle.color.primary,
    borderBottomWidth: 2
  },
  columns: {
    flex: 1
  },
  columnItem: {
    position: "relative",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    height: 80,
    padding: 5
  },
  currIcon: {
    position: "absolute",
    top: 25,
    left: 10,
    fontSize: 30,
    color: commonStyle.color.primary
  },
  learnedIcon: {
    position: "absolute",
    top: 25,
    right: 10,
    fontSize: 20,
    color: commonStyle.color.primary
  },
  columnItemInfo: {
    marginTop: 10,
    textAlign: "center"
  },
  rightCount: {
    color: commonStyle.color.primary
  },
  errCount: {
    color: commonStyle.color.danger
  },
  previewContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 17,
    width: "100%",
    height: 60,
    borderTopColor: commonStyle.color.primary,
    borderTopWidth: 1
  }
});
