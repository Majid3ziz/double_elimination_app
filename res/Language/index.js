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
  previous: "Previous",
  playersNumberInvalid: "Number of players must be four or more.",
  tournamentNameInvalid: "Tournament name must not be empty.",
  player: "Player",
  name: 'Name',
  create: 'Create',
  fillPlayersNames: 'Fill players\' names:',
  playerNameInvalid: "One of the players' name is invalid.",
  upperBracket: "Upper Bracket",
  lowerBracket: "Lower Bracket",
  vs: "vs",
  selectPlayerFirst: "Select a winning player first.",
  pickWinner: "Pick Winner",
  confirm: "Confirm",
  cancel: "Cancel",
  winner: "Winner",
  tapOnPlayerHint: "Tap on player\'s name to choose as winner",
  round: "Round",
  matchesResultsInvalid: "One or more of the matches results are invalid. Make sure to assign a winner to each match.",
  completeLowerBracketFirst: "Round does not exist. You should complete lower bracket matches first to advance to other rounds. ",
  completeUpperBracketFirst: "Round does not exist. You should complete upper bracket matches first to advance to other rounds. "
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
