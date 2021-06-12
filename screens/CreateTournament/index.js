/* eslint-disable react/require-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import AppContext from "@services/provider";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "@res/Colors";
import TextPopup from "@components/TextPopup";
import Button from "@components/smallButton";
import InputField from "@components/InputField";
import Constants from "@res/Constants";
import { createTournamentObject, createPlayerObject, addTournamentToLocalStorage, checkIfTournamentNameExist } from "@services/scripts";
import { NavigationActions, StackActions } from "react-navigation";
import CustomHeaderWithBackArrow from "@components/CustomHeaderWithBackArrow";

export default class CreateTournament extends React.Component {
  constructor() {
    super();
    this.genericSetState = this.genericSetState.bind(this);
    this.showAddPlayers = this.showAddPlayers.bind(this);
    this.createTournament = this.createTournament.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);
  }

  state = {
    loading: false,
    showTextPopup: false,
    TextPopupString: "",
    tournamentName: "",
    numberOfPlayers: 0,
    showAddPlayers: false,
    players: [],
  };

  genericSetState(key, value) {
    this.setState({ [key]: value });
  }

  setPlayerName(index, value) {
    const players = this.state.players;
    players[index].name = value;
    this.setState({ players });
  }

  showAddPlayers = async () => {
    const valid = !(await this.validateNameAndPlayersNumber());
    if (valid) {
      return;
    }
    const players = this.state.players;
    // initialize players
    for (let i = 0; i < this.state.numberOfPlayers; i++) {
      players[i] = createPlayerObject(i, "");
    }
    this.setState({ players, showAddPlayers: true });
  }

  validateNameAndPlayersNumber = async () => {
    const langauge = this.context.state.language;
    if (parseInt(this.state.numberOfPlayers) < Constants.minNumberOfPlayers) {
      this.setState({ showTextPopup: true, TextPopupString: langauge.playersNumberInvalid });
      return false;
    }
    if (this.state.tournamentName === "") {
      this.setState({ showTextPopup: true, TextPopupString: langauge.tournamentNameInvalid });
      return false;
    }

    if (await checkIfTournamentNameExist(this.state.tournamentName)) {
      this.setState({ showTextPopup: true, TextPopupString: langauge.tournamentExists });
      return false;
    }
    return true;
  }

  createTournament = async () => {
    this.setState({ loading: true });
    if (!this.validatePlayersNames()) {
      this.setState({ loading: false });
      return;
    }
    const players = this.state.players;
    // create dummy player if players number is odd.
    if (players.length % 2 !== 0) {
      players[players.length] = createPlayerObject(players.length, "-");
    }

    const tournament = createTournamentObject(this.state.tournamentName, players);
    await addTournamentToLocalStorage(tournament);
    this.setState({ loading: false });
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "Homepage" })],
      })
    );
  };

  validatePlayersNames() {
    const langauge = this.context.state.language;
    const players = this.state.players;
    for (let i = 0; i < players.length; i++) {
      if (players[i].name === "") {
        this.setState({ showTextPopup: true, TextPopupString: langauge.playerNameInvalid });
        return false;
      }
    }
    return true;
  }

  render() {
    const langauge = this.context.state.language;
    return (
      <View style={styles.container}>
        <CustomHeaderWithBackArrow title={langauge.addTournament} navigation={this.props.navigation} />
        <Spinner visible={this.state.loading} textContent={langauge.loading} textStyle={styles.spinnerTextStyle} />
        <TextPopup
          onPress={() => {
            this.setState({ showTextPopup: false, TextPopupString: "" });
          }}
          isModalVisible={this.state.showTextPopup}
          text={this.state.TextPopupString}
        />

        <ScrollView contentContainerStyle={styles.innerContainer} showsVerticalScrollIndicator={false}>
          {this.state.showAddPlayers ? null : (
            <View>
              <InputField onChangeText={this.genericSetState} stateKey={"tournamentName"} defaultValue={this.state.tournamentName} editable maxLength={50} style={styles.InputField} placeholder={langauge.tournamentName} keyboardType={"default"} />
              <InputField onChangeText={this.genericSetState} stateKey={"numberOfPlayers"} defaultValue={""} editable maxLength={10} style={styles.InputField} placeholder={langauge.numberOfPlayers} keyboardType={"numeric"} />
            </View>
          )}
          {this.state.showAddPlayers ? (
            <View>
              <Text style={styles.label}>{langauge.tournamentName + ": " + this.state.tournamentName}</Text>
              <Text style={styles.label}>{langauge.numberOfPlayers + ": " + this.state.numberOfPlayers}</Text>
              <Text style={[styles.label, styles.fillLabel]}>{langauge.fillPlayersNames}</Text>
            </View>
          ) : null}

          {this.state.players.map((value, i) => (
            <InputField onChangeText={this.setPlayerName} stateKey={i} defaultValue={this.state.players[i].name} editable maxLength={50} style={styles.InputField} placeholder={langauge.player + " " + (i + 1) + " Name"} keyboardType={"default"} key={i} />
          ))}
          <Button onPress={this.state.showAddPlayers ? this.createTournament : this.showAddPlayers} text={this.state.showAddPlayers ? langauge.create : langauge.next} textColor={Colors.PrimaryText} btnStyle={styles.button} />
        </ScrollView>
      </View>
    );
  }
}

CreateTournament.contextType = AppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  InputField: {
    alignSelf: "center",
    width: responsiveWidth(60),
    margin: 5,
    marginBottom: 30,
  },
  innerContainer: {
    marginTop: 30,
    paddingBottom: 30
  },
  fillLabel: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    color: Colors.SecondaryText,
    fontSize: responsiveFontSize(2.7),
    fontWeight: "500",
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 7,
  },
  button: {
    marginHorizontal: 5,
    width: responsiveWidth(30),
    alignSelf: "center",
    marginBottom: 30,
    backgroundColor: Colors.smallButtonColor
  },
});
