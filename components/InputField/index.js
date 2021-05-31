import React from "react";
import { StyleSheet, TextInput } from 'react-native';
import { responsiveWidth, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import AppContext from "@services/provider";
import Colors from "@res/Colors";

export default class InputField extends React.Component {

    render() {
        return (
            <TextInput
                onChangeText={(newValue) => {
                    this.props.onChangeText(this.props.stateKey, newValue);
                }}
                defaultValue={this.props.defaultValue}
                editable={this.props.editable}
                maxLength={this.props.maxLength}
                style={[styles.Input, this.props.style]}
                placeholder={this.props.placeholder}
                keyboardType={this.props.keyboardType}
            />
        );
    }
}


InputField.contextType = AppContext;
const styles = StyleSheet.create({
    Input: {
        justifyContent: "center",
        borderRadius: 15,
        borderStyle: "solid",
        width: responsiveWidth(35),
        height: responsiveHeight(6),
        backgroundColor: Colors.textFields,
        paddingHorizontal: 15,
        elevation: 7,
        shadowOffset: { width: 0, height: 12 },
        shadowColor: "#000",
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        fontSize: responsiveFontSize(2.5),
        color: Colors.SecondaryText
    }
});
