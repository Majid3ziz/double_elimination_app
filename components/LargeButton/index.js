import React from "react";
import { StyleSheet, Text } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import AppContext from "@services/provider";
import { LinearGradient } from 'expo-linear-gradient';

export default class LargeButton extends React.Component {

    render() {
        return (
            <LinearGradient
                colors={[this.props.colors[0], this.props.colors[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[this.props.btnStyle, styles.container]}
            >
                <Text style={[styles.label, { color: this.props.textColor }]}>{this.props.text}</Text>
            </LinearGradient>
        );
    }
}


LargeButton.contextType = AppContext;
const styles = StyleSheet.create({
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    label: {
        fontSize: responsiveFontSize(2.3),
        fontWeight: '500',
        elevation: 5,
        textAlign: 'center'
    },
});
