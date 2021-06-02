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
import { getTournaments } from "@services/scripts";
import MatchCard from "@components/MatchCard";

export default class ManageTournament extends React.Component {
  constructor() {
    super();
    this.showPopUp = this.showPopUp.bind(this);
    this.setWinner = this.setWinner.bind(this);
  }

  state = {
    loading: false,
    showTextPopup: false,
    TextPopupString: "",
    tournament: {},
    upperBracketCurrentRoundMatches: [],
    upperBracketCurrentRound: 0
  };

  componentDidMount() {
    const tournament = this.props.navigation.getParam("tournament", {});
    this.setUpperBracketRoundMatches(tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches);
    this.setState({ tournament, upperBracketCurrentRound: tournament.upperBracket.currentRoundIndex });
  }

  setUpperBracketRoundMatches(matches) {
    this.setState({ upperBracketCurrentRoundMatches: matches });
  }

  showPopUp(string) {
    this.setState({ showTextPopup: true, TextPopupString: string });
  }

  setWinner() {

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
          <Text style={[styles.label, { textAlign: 'center' }]}>{this.state.tournament.name}</Text>
          <Text style={styles.label}>{langauge.upperBracket}</Text>
          {this.state.upperBracketCurrentRoundMatches.map((match) => (
            <MatchCard
              showPopUp={this.showPopUp}
              setWinner={this.setWinner}
              matchNumber={match.number}
              firstPlayerID={match.players[0].id}
              firstPlayerName={match.players[0].name}
              secondPlayerID={match.players[1].id}
              secondPlayerName={match.players[1].name}
              winnerID={match.winnerID}
              key={match.number}
            />
          ))}
          <Text style={styles.label}>{langauge.lowerBracket}</Text>
        </ScrollView>
      </View>
    );
  }
}

ManageTournament.contextType = AppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  label: {
    color: Colors.SecondaryText,
    fontSize: responsiveFontSize(3),
    fontWeight: "500",
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 7,
  },
});
