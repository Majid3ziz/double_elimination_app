import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import Modal from "react-native-modal";
import AppContext from "@services/provider";
import Colors from "@res/Colors";
import LargeButton from "@components/LargeButton";

class TextPopup extends React.Component {
  render() {
    const language = this.context.state.language;
    return (
      <Modal isVisible={this.props.isModalVisible} transparent backButtonClose backdropPressToClose animationIn="zoomIn" animationOut="zoomOut">
        <View style={styles.Container}>
          <View style={styles.secondContainer}>
            <Text style={styles.headerText}>{language.notification}</Text>
            <ScrollView>
              <Text style={[styles.infoText, { textAlign: "center" }]}>{this.props.text}</Text>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this.props.onPress}>
                <LargeButton colors={Colors.ButtonColors} textColor="white" text={language.ok} btnStyle={styles.button} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
TextPopup.contextType = AppContext;
export default TextPopup;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.SecondaryText,
    fontSize: responsiveFontSize(2.3),
    fontWeight: "500",
    elevation: 5,
    marginHorizontal: 5,
    paddingTop: 2,
  },
  secondContainer: {
    alignItems: "center",
    width: responsiveWidth(75),
    height: responsiveHeight(40),
    backgroundColor: Colors.PopUpBackground,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    borderRadius: 7,
    height: responsiveHeight(7),
    width: responsiveWidth(50),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  infoText: {
    color: Colors.PrimaryText,
    fontSize: responsiveFontSize(2.3),
    fontWeight: "300",
    elevation: 5,
    marginHorizontal: 15,
    paddingTop: 2,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
  },
  headerText: {
    color: Colors.PrimaryText,
    fontSize: responsiveFontSize(3),
    fontWeight: "500",
    elevation: 5,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingTop: 2,
    textAlign: "center",
  },
});
