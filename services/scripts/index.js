import AsyncStorage from "@react-native-async-storage/async-storage";

export function createTournamentObject(name, players) {
    return {
        upperBracket: createUpperBracketRounds(players),
        lowerBracket: null,
        currentBracket: 'upper',
        isBracketArrangingRound: true,
        isAfterArrangingRound: false,
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
        firstRoundMatches[i] = createMatch(i + 1, null, []); // matches number starts from 1.
        // randomly assign nonAssignedPlayers to the match.
        assignedPlayers = 0;
        while (assignedPlayers !== 2) { // ensures adding two players to the match.
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
    rounds[0] = createRound(firstRoundMatches);
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

export function createLowerBracket(tournament) {
    const matches = [];
    const rounds = [];
    const upperBracketPassedMatches = [...tournament.upperBracket.rounds[0].matches];
    let winnerID;
    let loserPLayer;
    let matchTempIndex = 0;
    let assignedPlayers = 0;
    let matchNumber = upperBracketPassedMatches[upperBracketPassedMatches.length - 1].number;
    // take out dummy players matches.
    for (let i = 0; i < upperBracketPassedMatches.length; i++) {
        if (upperBracketPassedMatches[i].players[0].name === '-') {
            upperBracketPassedMatches.splice(i, 1);
        } else if (upperBracketPassedMatches[i].players[1].name === '-') {
            upperBracketPassedMatches.splice(i, 1);
        }
    }
    // create matches for losing players.
    for (let i = 0; i < upperBracketPassedMatches.length; i += 2) {
        matches[matchTempIndex] = createMatch(matchNumber + 1, null, []);
        matchNumber++;
        assignedPlayers = 0;
        while (assignedPlayers !== 2) {
            if (upperBracketPassedMatches[i + assignedPlayers] !== null) { // ensures creating a game for one person if matches size is odd.
                winnerID = upperBracketPassedMatches[i + assignedPlayers].winnerID;
                if (winnerID === upperBracketPassedMatches[i + assignedPlayers].players[0].id) {
                    loserPLayer = upperBracketPassedMatches[i + assignedPlayers].players[1];
                } else {
                    loserPLayer = upperBracketPassedMatches[i + assignedPlayers].players[0];
                }
                matches[matchTempIndex].players.push(loserPLayer);
            }
            assignedPlayers++;
        }
        matchTempIndex++;
    }
    rounds[0] = createRound(matches);

    const roundsCount = Math.ceil(Math.log2(matches.length));
    return {
        rounds,
        currentRoundIndex: 0,
        roundsCount,
    };
}

export function createUpperBracketRound(lastRoundMatches, lastMatchNumber) {
    const matches = [...lastRoundMatches];
    const newMatches = [];
    let assignedPlayers = 0;
    let j = 0;
    for (let i = 0; i < matches.length; i += 2) {
        newMatches[j] = createMatch(lastMatchNumber + j + 1, null, []);
        assignedPlayers = 0;
        while (assignedPlayers !== 2) {
            if (matches[i + assignedPlayers] !== null) { // ensures creating a game for one person if matches size is odd.
                if (matches[i + assignedPlayers].winnerID === matches[i + assignedPlayers].players[0].id) {
                    newMatches[j].players.push(matches[i + assignedPlayers].players[0]);
                } else {
                    newMatches[j].players.push(matches[i + assignedPlayers].players[1]);
                }
            }
            assignedPlayers++;
        }
        j++;
    }
    return createRound(newMatches);
}

export function createLowerBracketRound(lastRoundMatches, upperLastRoundMatches, lastMatchNumber, isCconsecutive) {
    const matches = [...lastRoundMatches];
    const upperMatches = [...upperLastRoundMatches];
    const newMatches = [];
    let assignedPlayers = 0;
    let j = 0; // index for lower matches.
    for (let i = 0; i < isCconsecutive ? (matches.length / 2) : (upperMatches.length / 2); i++) {
        newMatches[i] = createMatch(lastMatchNumber + i + 1, null, []);
        assignedPlayers = 0;
        while (assignedPlayers !== 2) {
            if (matches[j + assignedPlayers] !== null) { // ensures creating a game for one person if matches size is odd.
                if (matches[j + assignedPlayers].winnerID === matches[j + assignedPlayers].players[0].id) {
                    newMatches[i].players.push(matches[j + assignedPlayers].players[0]);
                } else {
                    newMatches[i].players.push(matches[j + assignedPlayers].players[1]);
                }
                assignedPlayers++;
            } else {
                if (isCconsecutive) {
                    assignedPlayers++;
                }
            }
            if (!isCconsecutive) {
                if (upperMatches[i].winnerID === upperMatches[i].players[0].id) {
                    newMatches[i].players.push(upperMatches[i].players[1]);
                } else {
                    newMatches[i].players.push(upperMatches[i].players[0]);
                }
                assignedPlayers++;
            }
        }
        if (isCconsecutive) {
            j += 2;
        } else {
            j++;
        }
    }
    console.log(createRound(newMatches));
    return createRound(newMatches);
}

export function createPlayerObject(id, name, lastMatchResult, currentMatch) {
    return {
        id,
        name,
        lastMatchResult,
        currentMatch
    };
}

function createMatch(number, winnerID, players) {
    return {
        number,
        winnerID,
        players
    };
}

function createRound(matches) {
    return {
        matches,
        finished: false
    }
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

export async function saveTournamentChanges(tournament) {
    let tournaments = await AsyncStorage.getItem("tournaments");
    tournaments = JSON.parse(tournaments);
    for (let i = 0; i < tournaments.length; i++) {
        if (tournaments[i].name === tournament.name) {
            tournaments[i] = tournament;
            break;
        }
    }
    await AsyncStorage.setItem("tournaments", JSON.stringify(tournaments));
    return;
}
