import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { responsiveWidth, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import AppContext from "@services/provider";

export default class Button extends React.Component {

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.onPress()} style={[styles.container, this.props.btnStyle, { backgroundColor: this.props.backgroundColor }]}>
                <Text style={[styles.label, { color: this.props.textColor }]}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}


Button.contextType = AppContext;
const styles = StyleSheet.create({
    container: {
        padding: 5,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    },
    label: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: '500',
        textAlign: 'center'
    },
});
