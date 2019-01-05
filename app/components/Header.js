import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Image
} from "react-native";
import { withNavigation } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import PropTypes from "prop-types";
import Icons from "react-native-vector-icons/Entypo";

// const { width } = Dimensions.get('window');

class Header extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    showLeft: true,
    transparent: false
  };
  static propTypes = {
    title: PropTypes.string, //标题
    showLeft: PropTypes.bool, //是否显示左侧组件
    transparent: PropTypes.bool, //背景颜色是否透明
    headerLeft: PropTypes.element, //标题左侧组件
    headerRight: PropTypes.element, //标题右侧组件
    headerBody: PropTypes.element
  };

  componentDidMount() {
  }
  _getSlotCompt(slotName) {
    let matched = false;
    let resultArr = React.Children.map(this.props.children, child => {
      let slot = child.props.slot;
      if (!matched && slot && slot === slotName) {
        matched = true;
        return child;
      }
    });
    return (resultArr && resultArr[0]) || null;
  }
  _getHeaderLeft() {
    //left
    const { showLeft } = this.props;
    const { goBack } = this.props.navigation;
    if (showLeft) {
      let leftCompt = this._getSlotCompt("left");
      if (!leftCompt) {
        return (
          <TouchableHighlight
            underlayColor="rgba(255,255,255,0.2)"
            onPress={() => {
              this.props.onBack && this.props.onBack();
              goBack();
            }}
            style={styles.goBackBtn}
            activeOpacity={1}
          >
            <Icons
              name="chevron-thin-left"
              size={20}
              color="#ffffff"
              style={styles.icon}
            />
          </TouchableHighlight>
        );
      }
      return leftCompt;
    }
    return null;
  }
  _getCenter() {
    //body
    const { title } = this.props;
    let centerCompt = this._getSlotCompt("center");
    if (!centerCompt) {
      if (title) {
        return (
          <Text style={styles.headerTitleText} numberOfLines={1}>
            {title}
          </Text>
        );
      }
    }
    return centerCompt;
  }
  render() {
    const { transparent } = this.props;
    let opacity = transparent ? 0 : 1;
    return (
      <View style={styles.headerContainer}>
        <LinearGradient
          style={[styles.headerImage, { opacity: opacity }]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          colors={["#24A9FE", "#06E2FF"]}
        />
        <View style={styles.headerItems}>{this._getHeaderLeft()}</View>
        <View style={styles.body}>{this._getCenter()}</View>
        <View style={styles.headerItems}>{this._getSlotCompt("right")}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerImage: {
    width: "100%",
    height: 50,
    position: "absolute",
    top: 0,
    left: 0
  },
  headerItems: {
    width: "25%"
  },
  body: {
    width: "50%"
  },
  icon: {
    // marginLeft: 15
  },
  goBackBtn: {
    width: 100,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  headerTitleText: {
    fontSize: 16,
    color: "#ffffff",
    alignSelf: "center"
  }
});

export default withNavigation(Header);
