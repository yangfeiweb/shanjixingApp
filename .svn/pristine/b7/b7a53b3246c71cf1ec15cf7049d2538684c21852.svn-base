import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "native-base";
import globalStyle from "../../../globalStyle";

export default class extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tabs, activeTab, goToPage } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          height: 45
        }}
      >
        {tabs.map((item, index) => {
          let buttonStyle = null;
          let textStyle = null;
          if (activeTab === index) {
            buttonStyle = {
              backgroundColor: globalStyle.color.primary
            };
            textStyle = {
              color: "#fff"
            };
          } else {
            buttonStyle = {
              backgroundColor: "#fff"
            };
            textStyle = {
              color: globalStyle.color.primary
            };
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                goToPage(index);
              }}
              activeOpacity={0.8}
              style={[
                buttonStyle,
                {
                  width: "50%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Text style={textStyle}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
