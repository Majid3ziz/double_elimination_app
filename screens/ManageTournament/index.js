/* eslint-disable react/require-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { ScrollView, View, StyleSheet, Text, Image } from "react-native";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import AppContext from "@services/provider";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "@res/Colors";
import Images from "@res/Images";
import TextPopup from "@components/TextPopup";
import Button from "@components/smallButton";
import { saveTournamentChanges, createLowerBracket, createUpperBracketRound, createLowerBracketRound, createFinalMatch, createFinalMatchIfUpperLoses } from "@services/scripts";
import MatchCard from "@components/MatchCard";
import CustomHeaderWithBackArrow from "@components/CustomHeaderWithBackArrow";

export default class ManageTournament extends React.Component {
  constructor() {
    super();
    this.showPopUp = this.showPopUp.bind(this);
    this.setWinner = this.setWinner.bind(this);
    this.goNextUpper = this.goNextUpper.bind(this);
    this.goPrevUpper = this.goPrevUpper.bind(this);
    this.goNextLower = this.goNextLower.bind(this);
    this.goPrevLower = this.goPrevLower.bind(this);
    this.setFinalWinner = this.setFinalWinner.bind(this);
  }

  state = {
    loading: false,
    showTextPopup: false,
    TextPopupString: "",
    tournament: { finalMatches: [], isWon: false },
    upperBracketCurrentRoundMatches: [],
    upperBracketCurrentRound: 0,
    lowerBracketCurrentRoundMatches: [],
    lowerBracketCurrentRound: 0,
    upperBracketRoundsLength: 0,
    lowerBracketRoundsLength: 0,
  };

  componentDidMount() {
    const tournament = this.props.navigation.getParam("tournament", {});
    this.setUpperBracketRoundMatches(tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches);
    if (tournament.lowerBracket !== null) {
      this.setLowerBracketRoundMatches(tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches);
      this.setState({ lowerBracketRoundsLength: tournament.lowerBracket.roundsCount, lowerBracketCurrentRound: tournament.lowerBracket.currentRoundIndex });
    }
    this.setState({ tournament, upperBracketCurrentRound: tournament.upperBracket.currentRoundIndex, upperBracketRoundsLength: tournament.upperBracket.roundsCount });
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
  };

  setFinalWinner = async (id, matchNumber, bracket) => {
    this.setState({ loading: true });
    const matches = this.state.tournament.finalMatches;
    const tournament = this.state.tournament;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].number === matchNumber) {
        matches[i].winnerID = id;
        break;
      }
    }
    if (matches.length === 1) {
      if (matches[0].players[0].id === matches[0].winnerID) { // upper bracket player is the first player in the array
        tournament.isWon = true;
        tournament.winner = matches[0].players[0].name;
      } else {
        const newFinalMatch = createFinalMatchIfUpperLoses(matches[0]);
        tournament.finalMatches.push(newFinalMatch);
      }
    } else {
      if (matches[1].winnerID === matches[1].players[0].id) {
        tournament.isWon = true;
        tournament.winner = matches[1].players[0].name;
      } else {
        tournament.isWon = true;
        tournament.winner = matches[1].players[1].name;
      }
    }
    await saveTournamentChanges(tournament);
    this.setState({ tournament, loading: false });
  }

  goToRound = async (bracket, index) => {
    const tournament = this.state.tournament;
    const langauge = this.context.state.language;
    let currentRound;
    if (bracket === "upper") {
      currentRound = tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex];
    } else {
      if (tournament.lowerBracket === null) {
        this.setState({ showTextPopup: true, TextPopupString: langauge.completeUpperBracketFirst });
        return;
      }
      currentRound = tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex];
    }

    // supports navigation to older rounds.
    if (bracket === "upper") {
      if (index <= tournament.upperBracket.currentRoundIndex) {
        if (tournament.upperBracket.rounds[index] === undefined) {
          this.setState({ showTextPopup: true, TextPopupString: langauge.completeLowerBracketFirst });
          return;
        }
        this.setUpperBracketRoundMatches(tournament.upperBracket.rounds[index].matches);
        this.setState({ upperBracketCurrentRound: index });
        return;
      } else {
        if (tournament.currentBracket !== "upper") {
          if (tournament.finished) {
            this.setState({ showTextPopup: true, TextPopupString: langauge.bracketFinished });
            return;
          }
          this.setState({ showTextPopup: true, TextPopupString: langauge.completeLowerBracketFirst });
          return;
        }
      }
    }



    if (bracket === "lower" && tournament.lowerBracket !== null) {
      if (index <= tournament.lowerBracket.currentRoundIndex) {
        if (tournament.lowerBracket.rounds[index] === undefined) {
          this.setState({ showTextPopup: true, TextPopupString: langauge.completeUpperBracketFirst });
          return;
        }
        this.setLowerBracketRoundMatches(tournament.lowerBracket.rounds[index].matches);
        this.setState({ lowerBracketCurrentRound: index });
        return;
      } else {
        if (tournament.currentBracket !== "lower") {
          this.setState({ showTextPopup: true, TextPopupString: langauge.completeUpperBracketFirst });
          return;
        }
      }
    }

    if (tournament.finished) {
      this.setState({ showTextPopup: true, TextPopupString: langauge.bracketFinished });
      return;
    }

    // navigation to new rounds

    // check if it's last round.
    if (tournament.lowerBracket !== null) {
      if (tournament.lowerBracket.currentRoundIndex + 1 === tournament.lowerBracket.roundsCount && !tournament.finished) {
        // create final round.
        if (!this.validateAllMatches(tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches)) {
          this.setState({ showTextPopup: true, TextPopupString: langauge.matchesResultsInvalid });
          return;
        }
        this.setState({ loading: true });
        tournament.finished = true;
        const lastUpperMatch = tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches[0];
        const lastLowerMatch = tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches[0];
        const finalMatch = createFinalMatch(lastUpperMatch, lastLowerMatch);
        tournament.finalMatches.push(finalMatch);
        await saveTournamentChanges(tournament);
        this.setState({ loading: false, tournament });
        return;
      }
    }
    // creating new rounds
    if (!currentRound.finished) {
      // validate matches and create new round matches.
      if (!this.validateAllMatches(currentRound.matches)) {
        this.setState({ showTextPopup: true, TextPopupString: langauge.matchesResultsInvalid });
        return;
      }
      this.setState({ loading: true });
      if (tournament.isBracketArrangingRound) {
        currentRound.finished = true;
        const lowerBracket = createLowerBracket(tournament);
        tournament.lowerBracket = lowerBracket;
        tournament.isBracketArrangingRound = false;
        tournament.currentBracket = "lower";
        tournament.lowerBracket.currentRoundIndex = 0;
        await saveTournamentChanges(tournament);
        this.setState({ loading: false, tournament, lowerBracketCurrentRoundMatches: tournament.lowerBracket.rounds[0].matches, lowerBracketRoundsLength: tournament.lowerBracket.roundsCount });
      } else if (tournament.currentBracket === "upper") {
        currentRound.finished = true;
        // create new lower bracket round
        tournament.lowerBracket.shouldPlayConsecutiveRound = true;
        const lastRoundMatches = tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches;
        const upperLastRoundMatches = tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches;
        const lastMatchNumber = upperLastRoundMatches[upperLastRoundMatches.length - 1].number;
        const newRound = createLowerBracketRound(lastRoundMatches, upperLastRoundMatches, lastMatchNumber, false);
        tournament.lowerBracket.rounds.push(newRound);
        tournament.currentBracket = "lower";
        tournament.lowerBracket.currentRoundIndex++;
        await saveTournamentChanges(tournament);
        this.setState({ loading: false, tournament, lowerBracketCurrentRoundMatches: newRound.matches, lowerBracketCurrentRound: tournament.lowerBracket.currentRoundIndex });
      } else {
        currentRound.finished = true; // if lower bracket round finishes, check the need to create a consecutive round or create new upper round.
        if (tournament.lowerBracket.shouldPlayConsecutiveRound && tournament.isAfterArrangingRound) {
          // create a consecutive round.
          tournament.lowerBracket.shouldPlayConsecutiveRound = false;
          const lastRoundMatches = tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches;
          const upperLastRoundMatches = tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches;
          const lastMatchNumber = lastRoundMatches[lastRoundMatches.length - 1].number;
          const newRound = createLowerBracketRound(lastRoundMatches, upperLastRoundMatches, lastMatchNumber, true);
          tournament.lowerBracket.rounds.push(newRound);
          tournament.currentBracket = "lower";
          tournament.lowerBracket.currentRoundIndex++;
          await saveTournamentChanges(tournament);
          this.setState({ loading: false, tournament, lowerBracketCurrentRoundMatches: newRound.matches, lowerBracketCurrentRound: tournament.lowerBracket.currentRoundIndex });
        } else {
          // create new upper bracket round
          currentRound.finished = true;
          tournament.isAfterArrangingRound = true;
          const prevRoundMatches = tournament.lowerBracket.rounds[tournament.lowerBracket.currentRoundIndex].matches;
          const lastMatchNumber = prevRoundMatches[prevRoundMatches.length - 1].number;
          const upperCurrentMatches = tournament.upperBracket.rounds[tournament.upperBracket.currentRoundIndex].matches;
          const newRound = createUpperBracketRound(upperCurrentMatches, lastMatchNumber);
          tournament.upperBracket.rounds.push(newRound);
          tournament.currentBracket = "upper";
          tournament.upperBracket.currentRoundIndex++;
          await saveTournamentChanges(tournament);
          this.setState({ loading: false, tournament, upperBracketCurrentRoundMatches: newRound.matches, upperBracketCurrentRound: tournament.upperBracket.currentRoundIndex });
        }
      }
    }

  };

  validateAllMatches(matches) {
    let valid = true;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].winnerID === null) {
        valid = false;
        break;
      }
    }
    if (valid) return true;
    return false;
  }

  goPrevUpper() {
    this.goToRound("upper", this.state.upperBracketCurrentRound - 1);
  }
  goNextUpper() {
    this.goToRound("upper", this.state.upperBracketCurrentRound + 1);
  }
  goPrevLower() {
    this.goToRound("lower", this.state.lowerBracketCurrentRound - 1);
  }
  goNextLower() {
    this.goToRound("lower", this.state.lowerBracketCurrentRound + 1);
  }

  render() {
    const langauge = this.context.state.language;
    return (
      <View style={styles.container}>
        <CustomHeaderWithBackArrow title={this.state.tournament.name} navigation={this.props.navigation} />
        <Spinner visible={this.state.loading} textContent={langauge.loading} textStyle={styles.spinnerTextStyle} />
        <TextPopup
          onPress={() => {
            this.setState({ showTextPopup: false, TextPopupString: "" });
          }}
          isModalVisible={this.state.showTextPopup}
          text={this.state.TextPopupString}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.tournament.isWon ?
            <View style={styles.winnerConatiner}>
              <Image style={styles.trophyImg} source={Images.trophy} />
              <Text style={styles.label}>{langauge.tournamentWinner + " " + this.state.tournament.winner}</Text>
            </View> : null}
          <View style={styles.bracketRow}>
            <Text style={styles.label}>{langauge.upperBracket}</Text>
            <View style={styles.roundContainer}>
              <Text style={styles.label}>{langauge.round + " " + (this.state.upperBracketCurrentRound + 1) + "/" + this.state.upperBracketRoundsLength}</Text>
              <View style={styles.buttonsRow}>
                <Button onPress={this.goPrevUpper} text={langauge.previous} textColor={Colors.PrimaryText} btnStyle={styles.button} />
                <Button onPress={this.goNextUpper} text={langauge.next} textColor={Colors.PrimaryText} btnStyle={styles.button} />
              </View>
            </View>
          </View>
          <View style={styles.matchesContainer}>
            {this.state.upperBracketCurrentRoundMatches.map((match) => (
              <MatchCard
                showPopUp={this.showPopUp}
                setWinner={this.setWinner}
                matchNumber={match.number}
                firstPlayerID={match.players[0].id}
                firstPlayerName={match.players[0].name}
                secondPlayerID={match.players[1] === undefined ? null : match.players[1].id}
                secondPlayerName={match.players[1] === undefined ? "-" : match.players[1].name}
                winnerID={match.winnerID}
                key={match.number}
                bracket={"upper"}
              />
            ))}
          </View>
          <View style={styles.bracketRow}>
            <Text style={styles.label}>{langauge.lowerBracket}</Text>
            <View style={styles.roundContainer}>
              <Text style={styles.label}>{langauge.round + " " + (this.state.lowerBracketCurrentRound + 1) + "/" + this.state.lowerBracketRoundsLength}</Text>
              <View style={styles.buttonsRow}>
                <Button onPress={this.goPrevLower} text={langauge.previous} textColor={Colors.PrimaryText} btnStyle={styles.button} />
                <Button onPress={this.goNextLower} text={langauge.next} textColor={Colors.PrimaryText} btnStyle={styles.button} />
              </View>
            </View>
          </View>
          <View style={styles.matchesContainer}>
            {this.state.lowerBracketCurrentRoundMatches.map((match) => (
              <MatchCard
                showPopUp={this.showPopUp}
                setWinner={this.setWinner}
                matchNumber={match.number}
                firstPlayerID={match.players[0].id}
                firstPlayerName={match.players[0].name}
                secondPlayerID={match.players[1] === undefined ? null : match.players[1].id}
                secondPlayerName={match.players[1] === undefined ? "-" : match.players[1].name}
                winnerID={match.winnerID}
                key={match.number}
                bracket={"lower"}
              />
            ))}
          </View>

          {this.state.tournament.finalMatches.length !== 0 ?
            <View>
              <Text style={styles.label}>{langauge.finalMatches}</Text>
              <View style={styles.matchesContainer}>
                {this.state.tournament.finalMatches.map((match) => (
                  <MatchCard
                    showPopUp={this.showPopUp}
                    setWinner={this.setFinalWinner}
                    matchNumber={match.number}
                    firstPlayerID={match.players[0].id}
                    firstPlayerName={match.players[0].name}
                    secondPlayerID={match.players[1].id}
                    secondPlayerName={match.players[1].name}
                    winnerID={match.winnerID}
                    key={match.number}
                    bracket={"final"}
                  />
                ))}
              </View>
            </View>
            : null}


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
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bracketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roundContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  button: {
    marginHorizontal: 5,
    backgroundColor: Colors.smallButtonColor
  },
  trophyImg: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
  },
  winnerConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30
  }
});
