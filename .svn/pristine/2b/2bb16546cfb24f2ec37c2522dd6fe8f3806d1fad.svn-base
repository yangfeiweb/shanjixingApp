import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import globalStyle from "../../../globalStyle";
/**
 * 学习统计中的TabBar
 */
export default class ChartTabBar extends Component {
  constructor(props) {
    super(props);
  }
  _renderTabs(item, index) {
    const { activeTab, goToPage } = this.props;
    let borderStyle = null;
    let backgroundColor = null;
    let textColor = null;
    if (index === 0) {
      borderStyle = styles.rightBorder;
    } else if (index === 1) {
      borderStyle = styles.centerBorder;
    } else {
      borderStyle = styles.leftBorder;
    }

    if (activeTab === index) {
      backgroundColor = "#fff";
      textColor = globalStyle.color.primary;
    } else {
      backgroundColor = "transparent";
      textColor = "#fff";
    }
    return (
      <TouchableOpacity
        key={index}
        onPress={() => goToPage(index)}
        style={[
          styles.tabBtn,
          borderStyle,
          { backgroundColor: backgroundColor }
        ]}
        activeOpacity={1}
      >
        <Text style={{ color: textColor }}>{item}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    /**
     * tabs 存放每一项内容的标题的数组
     */
    const { tabs } = this.props;
    return (
      <View style={styles.container}>
        {tabs.map(this._renderTabs.bind(this))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  tabBtn: {
    width: "25%",
    paddingVertical: 5,
    paddingHorizontal: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff"
  },
  centerBorder: {
    borderWidth: 1
  },
  leftBorder: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderLeftWidth: 0
  },
  rightBorder: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRightWidth: 0
  }
});
