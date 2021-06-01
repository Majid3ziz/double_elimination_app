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
    players: []
  };

  componentDidMount() {

  }

  createTournament() {
    const players = this.state.players;

  }

  genericSetState(key, value) {
    this.setState({ [key]: value });
  }

  setPlayerName(index, value) {
    const players = this.state.players;
    players[index].name = value;
    this.setState({ players });
  }

  showAddPlayers() {
    this.setState({ loading: true });
    if (!this.validateNameAndPlayersNumber()) {
      this.setState({ loading: false });
      return;
    }
    const players = this.state.players;
    for (let i = 0; i < this.state.numberOfPlayers; i++) {
      players[i] = {
        name: '',
        id: i
      }
    }
    this.setState({ players, showAddPlayers: true, loading: false });
  }

  validateNameAndPlayersNumber() {
    const langauge = this.context.state.language;
    if (parseInt(this.state.numberOfPlayers) < Constants.minNumberOfPlayers) {
      this.setState({ showTextPopup: true, TextPopupString: langauge.playersNumberInvalid });
      return false;
    }
    if (this.state.tournamentName === '') {
      this.setState({ showTextPopup: true, TextPopupString: langauge.tournamentNameInvalid });
      return false;
    }
    return true;
  }


  render() {
    const langauge = this.context.state.language;
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.loading} textContent={langauge.loading} textStyle={styles.spinnerTextStyle} />
        <TextPopup
          onPress={() => {
            this.setState({ showTextPopup: false, TextPopupString: "" });
          }}
          isModalVisible={this.state.showTextPopup}
          text={this.state.TextPopupString}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.showAddPlayers ? null :
            <View>
              <InputField
                onChangeText={this.genericSetState}
                stateKey={'tournamentName'}
                defaultValue={this.state.tournamentName}
                editable
                maxLength={50}
                style={styles.InputField}
                placeholder={langauge.tournamentName}
                keyboardType={'default'}
              />
              <InputField
                onChangeText={this.genericSetState}
                stateKey={'numberOfPlayers'}
                defaultValue={''}
                editable
                maxLength={10}
                style={styles.InputField}
                placeholder={langauge.numberOfPlayers}
                keyboardType={'numeric'}
              />
            </View>
          }
          {this.state.showAddPlayers ?
            <View>
              <Text style={styles.label}>{langauge.tournamentName + ': ' + this.state.tournamentName}</Text>
              <Text style={styles.label}>{langauge.numberOfPlayers + ': ' + this.state.numberOfPlayers}</Text>
              <Text style={[styles.label, styles.fillLabel]}>{langauge.fillPlayersNames}</Text>
            </View> : null}

          {this.state.players.map((value, i) => (
            <InputField
              onChangeText={this.setPlayerName}
              stateKey={i}
              defaultValue={this.state.players[i].name}
              editable
              maxLength={50}
              style={styles.InputField}
              placeholder={langauge.player + ' ' + (i + 1) + ' Name'}
              keyboardType={'default'}
              key={i}
            />
          ))}
          <Button onPress={this.state.showAddPlayers ? this.createTournament : this.showAddPlayers} text={this.state.showAddPlayers ? langauge.create : langauge.next} backgroundColor={Colors.smallButtonColor} textColor={Colors.PrimaryText} btnStyle={styles.button} />
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
    paddingTop: 30
  },
  InputField: {
    alignSelf: 'center',
    width: responsiveWidth(60),
    margin: 5,
    marginBottom: 30
  },
  fillLabel: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10
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
    alignSelf: 'center',
    marginBottom: 30
  },
});
