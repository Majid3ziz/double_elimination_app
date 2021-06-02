import AsyncStorage from "@react-native-async-storage/async-storage";

const en = {
  lang: "en",
  tournaments: "Tournaments",
  loading: "Loading...",
  ok: "OK",
  notification: "Notification",
  addTournament: "Create a Tournament",
  tournamentName: "Tournament Name",
  numberOfPlayers: "Number Of Players",
  next: "Next",
  playersNumberInvalid: "Number of players must be four or more.",
  tournamentNameInvalid: "Tournament name must not be empty.",
  player: "Player",
  name: 'Name',
  create: 'Create',
  fillPlayersNames: 'Fill players\' names:',
  playerNameInvalid: "One of the players' name is invalid."
};
const ar = {
  lang: "ar",
};

const language = async () => {
  const value = await AsyncStorage.getItem("lang");
  if (value === null) {
    return en;
  }
  if (value === "ar") {
    return ar;
  }
  return en;
};

export default language;
