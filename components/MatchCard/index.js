import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { responsiveWidth, responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import Colors from "@res/Colors";
import AppContext from "@services/provider";
import Button from "@components/smallButton";

export default class MatchCard extends React.Component {

  constructor() {
    super();
    this.setWinner = this.setWinner.bind(this);
    this.showPickWinner = this.showPickWinner.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  state = {
    showPickWinner: false,
    selectedWinner: null,
  }

  setWinner() {
    if (this.state.selectedWinner === null) {
      const langauge = this.context.state.language;
      this.props.showPopUp(langauge.selectPlayerFirst);
    } else {
      this.props.setWinner(this.state.selectedWinner, this.props.matchNumber, this.props.bracket);
      this.setState({ showPickWinner: false });
    }
  }

  showPickWinner() {
    this.setState({ showPickWinner: true });
  }

  opacityOfPlayer(id) {
    return { opacity: this.state.showPickWinner ? this.state.selectedWinner === id ? 1 : 0.3 : 1 };
  }

  pickPlayer(id) {
    if (this.state.showPickWinner)
      this.setState({ selectedWinner: id });
  }

  getWinner() {
    if (this.props.winnerID === this.props.firstPlayerID) {
      return this.props.firstPlayerName;
    } else if (this.props.winnerID === this.props.secondPlayerID) {
      return this.props.secondPlayerName;
    }
    return "-";
  }

  cancel() {
    this.setState({ showPickWinner: false, selectedWinner: null });
  }

  render() {
    const langauge = this.context.state.language;
    return (
      <View style={styles.container}>
        <Text style={[styles.label, { textAlign: 'center' }]}>{"#" + this.props.matchNumber}</Text>
        <View style={styles.playersRow}>
          <TouchableOpacity onPress={() => this.pickPlayer(this.props.firstPlayerID)}>
            <Text style={[styles.label, this.opacityOfPlayer(this.props.firstPlayerID)]}>{this.props.firstPlayerName}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>{langauge.vs}</Text>
          <TouchableOpacity onPress={() => this.pickPlayer(this.props.secondPlayerID)}>
            <Text style={[styles.label, this.opacityOfPlayer(this.props.secondPlayerID)]}>{this.props.secondPlayerName}</Text>
          </TouchableOpacity>
        </View>
        {this.state.showPickWinner ? <Text style={[styles.label, { fontSize: responsiveFontSize(1.5) }]}>{langauge.tapOnPlayerHint}</Text> : null}
        <Text style={styles.label}>{langauge.winner + " " + this.getWinner()}</Text>
        <View style={styles.buttonsRow}>
          <Button onPress={this.state.showPickWinner ? this.setWinner : this.showPickWinner} text={this.state.showPickWinner ? langauge.confirm : langauge.pickWinner} backgroundColor={Colors.smallButtonColor} textColor={Colors.PrimaryText} btnStyle={styles.button} />
          {this.state.showPickWinner ?
            <Button onPress={this.cancel} text={langauge.cancel} backgroundColor={Colors.smallButtonColor} textColor={Colors.PrimaryText} btnStyle={styles.button} />
            : null}
        </View>

      </View>
    );
  }
}

MatchCard.contextType = AppContext;
const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(45),
    height: responsiveHeight(20),
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: 'center',
    elevation: 7,
    shadowOffset: { width: 0, height: 12 },
    shadowColor: "#000",
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  playersRow: {
    width: responsiveWidth(35),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonsRow: {
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5
  },
  label: {
    color: Colors.PrimaryText,
    fontSize: responsiveFontSize(2),
    fontWeight: "500",
    elevation: 5,
    textAlign: "center",
    marginHorizontal: 5,
  },
  button: {
    marginHorizontal: 5
  }
});
