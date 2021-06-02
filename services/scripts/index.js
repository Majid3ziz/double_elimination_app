import AsyncStorage from "@react-native-async-storage/async-storage";

export function createTournamentObject(name, players) {
    return {
        upperBracket: createUpperBracketRounds(players),
        lowerBracket: null,
        currentBracket: 'Upper',
        name,
        players
    };
};

function createUpperBracketRounds(players) {
    const playersCount = players.length;
    const roundsCount = Math.ceil(Math.log2(playersCount / 2));
    const matchesCount = playersCount - 1;
    const playersArray = players;

    // create first round's matches.
    const rounds = [];
    const firstRoundMatchesCount = playersCount / 2;
    const firstRoundMatches = [];
    const nonAssignedPlayers = [...players];
    let randomNumber;
    let assignedPlayers = 0;
    for (let i = 0; i < firstRoundMatchesCount; i++) {
        // initiate match object.
        firstRoundMatches[i] = {
            number: i + 1, // matches number starts from 1.
            winnerID: null,
            players: []
        };
        // randomly assign nonAssignedPlayers to the match.
        assignedPlayers = 0; // ensures adding two players to the match.
        while (assignedPlayers !== 2) {
            randomNumber = randomInteger(0, nonAssignedPlayers.length - 1); // returns random index.
            firstRoundMatches[i].players.push({
                id: nonAssignedPlayers[randomNumber].id,
                name: nonAssignedPlayers[randomNumber].name
            });
            playersArray[nonAssignedPlayers[randomNumber].id].currentMatch = i + 1;
            nonAssignedPlayers.splice(randomNumber, 1); // if assigned, delete player from the array.
            assignedPlayers++;
        }
    }
    rounds[0] = { matches: firstRoundMatches };
    return {
        roundsCount,
        matchesCount,
        currentRoundIndex: 0,
        rounds,
    };
}

function randomInteger(min, max) { // including max and min
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPlayerObject(id, name, lastMatchResult, currentMatch) {
    return {
        id,
        name,
        lastMatchResult,
        currentMatch
    };
}

export async function addTournamentToLocalStorage(tournament) {
    let tournaments = await AsyncStorage.getItem("tournaments");
    if (tournaments === null) {
        tournaments = [];
        tournaments[0] = tournament;
    } else {
        tournaments = JSON.parse(tournaments);
        tournaments[tournaments.length] = tournament;
    }
    await AsyncStorage.setItem("tournaments", JSON.stringify(tournaments));
    return;
}

export async function getTournaments() {
    let tournaments = await AsyncStorage.getItem("tournaments");
    if (tournaments === null) {
        tournaments = [];
    } else {
        tournaments = JSON.parse(tournaments);
    }
    return tournaments;
}
