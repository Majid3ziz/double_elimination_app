
export const createUpperBracketRounds = (players) => {
    const playersCount = players.length;
    const roundsCount = Math.ceil(Math.log2(playersCount / 2));
    const matchesCount = playersCount - 1;
    const rounds = [];
    const firstRoundMatchesCount = playersCount / 2;
    const firstRoundMatches = [];
    // assign half of the players randomly to matches, the index is random between 0 and size, ensuring complete random pairing.
    const playersArray = players;
    for (let i = 0; i < firstRoundMatchesCount; i++) {
        playersArray[randomInteger(0, playersCount - 1)].currentMatch = i + 1; // matches number starts from 1
    }
    // pair the unmatched with those who got assigned to matches
    let tempMatchIndex = 1;
    for (let i = 0; i < playersCount; i++) {
        if (playersArray[i].currentMatch === undefined) {
            playersArray[i].currentMatch = tempMatchIndex++;
        }
    }
    // create first round's matches
    for (let i = 0; i < firstRoundMatchesCount; i++) {
        firstRoundMatches[i] = {
            number: i + 1,
            winnerID: null,
            players: []
        };
        // assign already assigned players to their matches.
        for (let j = 0; j < playersCount; j++) {
            if (playersArray[j].currentMatch === i + 1) {
                firstRoundMatches[i].players.push({
                    id: playersArray[j].id,
                    name: playersArray[j].name
                });
            }
        }
    }
    rounds[0] = firstRoundMatches;
    return {
        roundsCount,
        matchesCount,
        playersArray,
        rounds,
    };
};

function randomInteger(min, max) { // including max and min
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

