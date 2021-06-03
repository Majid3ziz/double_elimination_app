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
import { saveTournamentChanges } from "@services/scripts";
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
    upperBracketCurrentRound: 0,
    lowerBracketCurrentRoundMatches: [],
    lowerBracketCurrentRound: 0,
    upperBracketRoundsLength: 0,
    lowerBracketRoundsLength: 0
  };

  componentDidMount() {
    const tournament = this.props.navigation.getParam("tournament", {});
    this.setUpperBracketRoundMatches(tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches);
    if (tournament.lowerBracket !== null)
      setLowerBracketRoundMatches(tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches)
    this.setState({ tournament, upperBracketCurrentRound: tournament.upperBracket.currentRoundIndex, upperBracketRoundsLength: tournament.upperBracket.roundsCount, lowerBracketRoundsLength: tournament.lowerBracket === null ? 0 : tournament.lowerBracket.roundsCount });
  }

  setUpperBracketRoundMatches(matches) {
    this.setState({ upperBracketCurrentRoundMatches: matches });
  }

  setLowerBracketRoundMatches(matches) {
    this.setState({ lowerBracketCurrentRoundMatches: matches });
  }

  showPopUp(string) {
    this.setState({ showTextPopup: true, TextPopupString: string });
  }

  setWinner = async (id, matchNumber, bracket) => {
    this.setState({ loading: true });
    let matches;
    if (bracket === "upper") {
      matches = this.state.upperBracketCurrentRoundMatches;
    } else {
      matches = this.state.lowerBracketCurrentRoundMatches;
    }
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].number === matchNumber) {
        matches[i].winnerID = id;
        break;
      }
    }
    if (bracket === "upper") {
      this.setState({ upperBracketCurrentRoundMatches: matches });
    } else {
      this.setState({ lowerBracketCurrentRoundMatches: matches });
    }
    await saveTournamentChanges(this.state.tournament);
    this.setState({ loading: false });
  }

  goToRound(bracket, index) {
    const langauge = this.context.state.language;
    let currentRound;
    if (bracket === 'upper') {
      currentRound = this.state.tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex];
    } else {
      currentRound = this.state.tournament.lowerBracket.rounds[tournament.upperBracket.currentRoundIndex];
    }
    if (!currentRound.finished) {
      // validate matches and create new round matches.
      if (!this.validateAllMatches(currentRound.matches)) {
        this.setState({ showTextPopup: true, TextPopupString: langauge.matchesResultsInvalid });
        return;
      }
      if (this.state.tournament.isBracketArrangingRound) {
        const lowerBracket = createLowerBracket(this.state.tournament);
        const tournament = this.state.tournament;
        tournament.lowerBracket = lowerBracket;
        tournament.isBracketArrangingRound = false;
        this.setState({ tournament });
        saveTournamentChanges(tournament);
      } else if (this.state.tournament.currentBracket === 'upper') {
        currentRound.finished = true;
        // create new lower bracket round
      } else {
        currentRound.finished = true; // if lower bracket round finishes, check the need to create a consecutive round.
        if (this.state.tournament.lowerBracket.shouldPlayConsecutiveRound && this.state.tournament.isAfterArrangingRound) {
          // create a consecutive round.
          this.state.tournament.lowerBracket.shouldPlayConsecutiveRound = false;
        } else {
          // create new upper bracket round
          this.state.tournament.isAfterArrangingRound = true;
        }
      }
    } else {
      // supports navigation to older rounds.
      if (bracket === 'upper') {
        if (this.state.tournament.upperBracket.rounds[index] === null) {
          this.setState({ showTextPopup: true, TextPopupString: langauge.completeLowerBracketFirst });
          return;
        }
        this.setUpperBracketRoundMatches(this.state.tournament.upperBracket.rounds[index].matches);
        this.setState({ upperBracketCurrentRound: index });
      } else {
        if (this.state.tournament.lowerBracket.rounds[index] === null) {
          this.setState({ showTextPopup: true, TextPopupString: langauge.completeUpperBracketFirst });
          return;
        }
        this.setLowerBracketRoundMatches(this.state.tournament.lowerBracket.rounds[index].matches);
        this.setState({ lowerBracketCurrentRound: index });
      }
    }
  }

  validateAllMatches(matches) {
    let valid = true;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].winnerID === null) {
        valid = false;
        break;
      }
    }
    if (valid)
      return true;
    return false
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
          <View style={styles.bracketRow}>
            <Text style={styles.label}>{langauge.upperBracket}</Text>
            <Text style={styles.label}>{langauge.round + " " + (this.state.upperBracketCurrentRound + 1) + '/' + this.state.upperBracketRoundsLength}</Text>
          </View>
          <View style={styles.matchesContainer}>
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
                bracket={'upper'}
              />
            ))}
          </View>
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
  matchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  bracketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
