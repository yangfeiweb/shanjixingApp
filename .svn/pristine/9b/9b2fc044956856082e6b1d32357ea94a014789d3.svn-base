import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import globalStyle from "../../../globalStyle/index";

export default class RegistryTabBar extends Component {
    constructor(props) {
        super(props)
        this._renderTabBar = this._renderTabBar.bind(this)
    }
    componentDidMount() {
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.activeTab !== this.props.activeTab
    }
    _renderTabBar(item, index) {
        const { activeTab, goToPage } = this.props
        let textColor = (activeTab === index) ? globalStyle.color.primary : "#fff"
        let backgroundColor = (activeTab === index) ? "#fff" : globalStyle.color.primary
        let style = [styles.tabBarItem, { backgroundColor: backgroundColor }]
        if (index === 0) {
            style.push(styles.first)
        } else {
            style.push(styles.second)
        }
        return <TouchableOpacity key={index} onPress={() => goToPage(index)} activeOpacity={1} style={style}>
            <Text style={{ color: textColor }}>{item}</Text>
        </TouchableOpacity>
    }
    render() {
        const { tabs } = this.props
        return (
            <View style={styles.container}>
                {
                    tabs.map(this._renderTabBar)
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    tabBarItem: {
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    first: {
        borderTopLeftRadius: 20,
    },
    second: {
        borderTopRightRadius: 20
    }
})