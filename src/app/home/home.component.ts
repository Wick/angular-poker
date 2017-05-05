import {
    Component
} from '@angular/core';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    public deck: Array < number[] > = [];
    public players: Array < Array < any >> = [];
    public suits: Array < string > = ['C', 'D', 'H', 'S'];
    public ranks: Array < string > = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    public results: Array < string > = ['2 high', '3 high', '4 high', '5 high', '6 high', '7 high', '8 high', '9 high', '10 high', 'J high', 'Q high', 'K high', 'A high', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush', 'Royal flush'];

    constructor() {}

    public reset() {
        this.deck = [];
        this.players = [];
        this.addDeck();
        this.shuffleDeck();
    }

    public resetGame() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i][1] = [];
            this.players[i][2] = null;
            this.players[i][3] = false;
        }
        this.deck = [];
        this.addDeck();
        this.shuffleDeck();
    }

    public addDeck() {
        for (let i = 0; i < this.suits.length; i++) {
            for (let j = 0; j < this.ranks.length; j++) {
                this.deck.push([i, j]);
            }
        }
    }

    public shuffleDeck() {
        for (let i = this.deck.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.deck[i - 1], this.deck[j]] = [this.deck[j], this.deck[i - 1]];
        }
    }

    public addPlayer(name) {
        if (name === '') {
            name = 'Player ' + (this.players.length + 1);
        }
        let player = [name, [], null, false];
        this.players.push(player);
    }

    public play() {
        this.resetGame();
        this.dealCards();
        this.scorePlayers();
        let highestScoreIndex = this.highestScore();
        this.setWinner(highestScoreIndex);
    }

    // Deal in right order, one at a time
    public dealCards() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < this.players.length; j++) {
                this.players[j][1].push(this.deck.splice(0, 1));
            }
        }
    }

    public scorePlayers() {
        for (let i = 0; i < this.players.length; i++) {
            let score = 0;
            let suits = [];
            let values = [];
            for (let j = 0; j < 5; j++) {
                suits.push(this.players[i][1][j][0][0]);
                values.push(this.players[i][1][j][0][1]);
            }
            let lowest = Math.min.apply(null, values);
            let isStraight = this.isStraight(values, lowest);
            let isFlush = this.isFlush(suits);

            switch (this.duplicateCards(values)) {
                case '2':
                    score = 13;
                    break;
                case '22':
                    score = 14;
                    break;
                case '3':
                    score = 15;
                    break;
                case '23':
                case '32':
                    score = 18;
                    break;
                case '4':
                    score = 19;
                    break;
                default:
                    break;
            }
            if (!isFlush) {
                if (isStraight && score < 16) {
                    score = 16;
                } else if (score === 0) {
                    if (lowest === 0) {
                        score = 12;
                    } else {
                        score = Math.max.apply(null, values) - 1;
                    }
                }
            } else {
                if (isStraight) {
                    if (lowest === 0) {
                        score = 21;
                    } else {
                        score = 20;
                    }
                } else if (score < 17) {
                    score = 17;
                }
            }
            this.players[i][2] = score;
        }
    }

    public isFlush(suits) {
        for (let i = 0; i < 4; i++) {
            if (suits[i] !== suits[i + 1]) {
                return false;
            }
        }
        return true;
    }

    public isStraight(values, lowest) {
        for (let i = 1; i < 5; i++) {
            if (this.occurrencesOf(lowest + i, values) !== 1) {
                // Check ace high
                if (lowest === 0) {
                    let low = 9;
                    for (let j = 1; j < 4; j++) {
                        if (this.occurrencesOf(low + j, values) !== 1) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            }
        }
        return true;
    }

    public duplicateCards(values) {
        let occurrencesFound = [];
        let result: string = '';
        for (let i = 0; i < values.length; i++) {
            let occurrences = this.occurrencesOf(values[i], values);
            if (occurrences > 1 && occurrencesFound.indexOf(values[i]) === -1) {
                result += occurrences.toString();
                occurrencesFound.push(values[i]);
            }
        }
        return result;
    }

    public highestScore() {
        let occurrencesFound = [];
        let scores = [];
        for (let i = 0; i < this.players.length; i++) {
            scores.push(this.players[i][2]);
        }
        let highest = Math.max.apply(null, scores);
        for (let i = 0; i < scores.length; i++) {
            if (scores[i] === highest) {
                occurrencesFound.push(i);
            }
        }
        return occurrencesFound;
    }

    public setWinner(highestScoreIndex) {
        // Insert tiebreaker around here
        for (let i = 0; i < highestScoreIndex.length; i++) {
            this.players[highestScoreIndex[i]][3] = true;
        }
    }

    public occurrencesOf(n, values) {
        let count: number = 0;
        let index: number = 0;
        do {
            index = values.indexOf(n, index) + 1;
            if (index === 0) {
                break;
            } else {
                count++;
            }
        } while (index < values.length);
        return count;
    }

}
