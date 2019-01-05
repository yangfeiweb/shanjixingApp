import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  PixelRatio,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

let barHeight = 50;
let iconHeight = 25;

class TabBar extends React.Component {
  icons = [];
  texts = [];

  constructor(props) {
    super(props);
    this.icons = [];
    this.texts = [];
    let deviceH = Dimensions.get("window").height;
    let deviceW = Dimensions.get("window").width;
    if (deviceH > deviceW) {
      deviceH = deviceW;
    }
    barHeight = Math.ceil(deviceH / 10);
    if (barHeight < 45) {
      barHeight = 45;
    }
    iconHeight = barHeight - 25;
  }

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(
      this.setAnimationValue.bind(this)
    );
    let { height, width } = Dimensions.get("window");
    // alert("Pixel: " + PixelRatio.get() + ", h: " + height + ", w: " + width);
  }

  setAnimationValue({ value }) {
    this.icons.forEach((icon, i) => {
      const progress = value - i >= 0 && value - i <= 1 ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress)
        }
      });
      this.texts[i].setNativeProps({
        style: {
          color: this.iconColor(progress)
        }
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (255 - 59) * progress;
    const green = 89 + (255 - 89) * progress;
    const blue = 152 + (255 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    return (
      <View style={[styles.tabs, this.props.style, { height: barHeight }]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => this.props.goToPage(i)}
              style={styles.tab}
            >
              <Icon
                name={this.props.tabInfos[i].icon}
                size={iconHeight}
                color={
                  this.props.activeTab === i
                    ? "rgb(59,89,152)"
                    : "rgb(255,255,255)"
                }
                ref={icon => {
                  this.icons[i] = icon;
                }}
              />
              <Text
                style={{
                  color:
                    this.props.activeTab === i
                      ? "rgb(59,89,152)"
                      : "rgb(255,255,255)"
                }}
                ref={texts => {
                  this.texts[i] = texts;
                }}
              >
                {this.props.tabInfos[i].title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5
  },
  tabs: {
    backgroundColor: "#4FC7FF",
    flexDirection: "row",
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: "rgba(0,0,0,0.05)"
  }
});

export default TabBar;
