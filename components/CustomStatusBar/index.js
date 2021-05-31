import React from "react";
import { StatusBar } from "react-native";
import Colors from '@res/Colors';
export default class CustomStatusBar extends React.Component {
    render() {
        return (
            <StatusBar
                backgroundColor={Colors.PrimaryColorDark}
            />

        );
    }
}
