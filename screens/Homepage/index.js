/* eslint-disable react/require-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import AppContext from "@services/provider";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "@res/Colors";
import TextPopup from "@components/TextPopup";
import Button from "@components/smallButton";
import { getTournaments, deleteTournament } from "@services/scripts";
import TournamentCard from "@components/TournamentCard";
import { NavigationEvents } from "react-navigation";
import CustomHeader from "@components/CustomHeader";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default class Homepage extends React.Component {
  constructor() {
    super();
    this.createTournament = this.createTournament.bind(this);
    this.viewTournament = this.viewTournament.bind(this);
  }

  state = {
    loading: false,
    showTextPopup: false,
    TextPopupString: "",
    tournaments: [],
    enableDelete: false,
  };

  componentDidMount() {
    this.getTournaments();
  }

  getTournaments = async () => {
    this.setState({ loading: true });
    const tournaments = await getTournaments();
    this.setState({ tournaments, loading: false });
  };

  createTournament() {
    this.props.navigation.navigate("CreateTournament");
  }

  viewTournament(index) {
    this.props.navigation.navigate("ManageTournament", { tournament: this.state.tournaments[index] });
  }

  deleteTournament = async (index) => {
    this.setState({ loading: true });
    const tournaments = this.state.tournaments;
    tournaments.splice(index, 1);
    await deleteTournament(index);
    this.setState({ tournaments, loading: false });
  };

  render() {
    const langauge = this.context.state.language;
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.getTournaments()} />
        <CustomHeader title={langauge.home} />
        <Spinner visible={this.state.loading} textContent={langauge.loading} textStyle={styles.spinnerTextStyle} />
        <TextPopup
          onPress={() => {
            this.setState({ showTextPopup: false, TextPopupString: "" });
          }}
          isModalVisible={this.state.showTextPopup}
          text={this.state.TextPopupString}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.upperRow}>
            <Text style={styles.label}>{langauge.tournaments}</Text>
            <View style={styles.iconsRow}>
              <TouchableOpacity onPress={() => this.setState({ enableDelete: !this.state.enableDelete })}>
                <Ionicons name={"ios-remove-circle"} color={this.state.enableDelete ? Colors.redAlert : Colors.PrimaryColorDark} size={responsiveFontSize(5)} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.createTournament()}>
                <Ionicons name={"ios-add-circle"} color={Colors.PrimaryColorDark} size={responsiveFontSize(5)} />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.tournaments.map((tournament, i) => (
            <View style={styles.tournamentConatiner}>
              <TournamentCard key={i} index={i} viewTournament={this.viewTournament} name={tournament.name} playersCount={tournament.players.length} image={"https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/8f/a3/57/8fa3572a-f506-7f21-5bc9-651c44ad30e8/source/512x512bb.jpg"} />
              {this.state.enableDelete ? (
                <TouchableOpacity onPress={() => this.deleteTournament(i)}>
                  <Ionicons name={"ios-trash"} color={Colors.redAlert} size={responsiveFontSize(4)} />
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

Homepage.contextType = AppContext;

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
  upperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: Colors.smallButtonColor,
  },
  tournamentConatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
