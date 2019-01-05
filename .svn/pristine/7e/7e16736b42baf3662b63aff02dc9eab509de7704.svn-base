import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { NoticeBar } from "../../../components";
import Icon from "react-native-vector-icons/FontAwesome";
import commonStyle from "../../../globalStyle";

export default class WordInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  show() {
    this.refs.historyView.show();
    setTimeout(() => {
      this.refs.scorllView.scrollTo({ x: 0, y: 0, animated: true });
    }, 200);
  }
  hide() {
    this.refs.historyView.hide();
  }
  scrollToFirst() {
    if (this.scrolled) {
      this.refs.scorllView.scrollTo({ x: 0, y: 0, animated: true });
      this.scrolled = false;
    }
  }
  renderHistoryItem() {
    let count = this.props.historyData.length;
    return this.props.historyData.map((item, idx) => {
      return (
        <View
          key={item.uuid}
          style={[
            styles.historyItem,
            { display: this.props.previewing ? "none" : "flex" }
          ]}
        >
          <TouchableOpacity
            style={item.isRight ? styles.wordItemRight : styles.wordItemErr}
            onPress={() => {
              this.props.onItemPress && this.props.onItemPress(item);
              // this.hide();
            }}
          >
            <Text style={styles.wordText}>{item.name}</Text>
          </TouchableOpacity>
          <Icon
            name="angle-right"
            style={[
              styles.rightArrowIcon,
              {
                display: idx == count - 1 ? "none" : "flex"
              }
            ]}
          />
        </View>
      );
    });
  }
  render() {
    return (
      // <NoticeBar ref="historyView" height={70}>
      <View style={styles.root}>
        <ScrollView
          ref="scorllView"
          horizontal
          style={[styles.scrollView]}
          onScroll={() => {
            this.scrolled = true;
          }}
        >
          {this.renderHistoryItem()}
        </ScrollView>
        <View style={styles.right}>
          {/* <Icon name="history" style={styles.upIcon} /> */}
          <Text style={styles.upTitle}>学习轨迹</Text>
          <Text style={styles.upSubTitle}>（最新20条）</Text>
        </View>
      </View>
      // </NoticeBar>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    backgroundColor: "#fff",
    flex: 1
  },
  left: {
    width: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  right: {
    // backgroundColor: "red",
    width: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollView: {
    flex: 1
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  wordItemRight: {
    height: 35,
    minWidth: 120,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    borderRadius: 5,
    // backgroundColor: commonStyle.color.lightGreen,
    borderColor: commonStyle.color.lightGreenBorder,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  wordItemErr: {
    height: 35,
    minWidth: 120,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    borderRadius: 5,
    // backgroundColor: commonStyle.color.lightRed,
    borderColor: commonStyle.color.lightRedBorder,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  wordText: {
    fontSize: 14
  },
  upTitle: {
    fontSize: 18,
    color: commonStyle.color.primary
  },
  upSubTitle: {
    fontSize: 12
  },
  upIcon: {
    fontSize: 24,
    height: 20,
    color: commonStyle.color.primary
  },
  rightArrowIcon: {
    fontSize: 30,
    color: "#aaa"
  }
});
