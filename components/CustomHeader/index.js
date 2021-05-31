import React from "react";
import { Header, Icon } from "react-native-elements";
import { responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import Colors from "@res/Colors";
import { Image } from "react-native";
export default class CustomHeader extends React.Component {
  render() {
    return (
      <Header
        centerComponent={{
          text: this.props.title,
          style: { color: Colors.PrimaryText, fontSize: responsiveFontSize(2.5) },
        }}
        statusBarProps={{
          barStyle: "light-content",
          backgroundColor: Colors.PrimaryColorDark,
        }}
        containerStyle={{
          backgroundColor: Colors.SecondaryColor,
          justifyContent: "space-around",
        }}
      />
    );
  }
}
