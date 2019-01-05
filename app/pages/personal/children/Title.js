import React from "react";
import { StyleSheet } from "react-native";
import { DialogTitle } from 'react-native-popup-dialog';
import PropTypes from "prop-types";

export default class Title extends React.Component {
    constructor(props) {
        super(props)
    }
    static propTypes = {
        title: PropTypes.string.isRequired
    }
    render() {
        return (<DialogTitle title={this.props.title} haveTitleBar={false} titleStyle={{ backgroundColor: "#56BDFF", height: 50, justifyContent: "center" }} titleTextStyle={{ color: "#fff" }} />)

    }
}