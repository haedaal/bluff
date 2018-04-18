import * as _ from "lodash";

interface Player {
  id: number;
  left: number;
  /**
   * -1 represents star
   * other numbers represent same number
   */
  dice: number[];
}

interface Bid {
  kind: number;
  number: number;
}

class Bluff {
  players: Player[];
  firstTurn: number;
  turn: number;
  /**
   * first bid is latest
   */
  bids: Bid[];

  finished: boolean = false;
  winner: number = -1;

  constructor(public numberOfPlayers: number) {
    this.players = _.range(0, numberOfPlayers).map(id => ({
      id,
      left: 5,
      dice: []
    }));
  }

  startBluff() {
    this.initDice();
    this.turn = this.firstTurn;
  }

  initDice() {
    this.players.forEach(p => {
      p.dice = _.range(0, p.left).map(__ => {
        const n = Math.floor(Math.random() * 6) + 1;
        // -1 is star
        return n !== 6 ? n : -1;
      });
    });
  }

  proceedTurn(action: Bid | "Bluff!") {
    if (action === "Bluff!") {
      this.bluff();
    } else {
      this.bid(action);
    }
  }

  isValidBid(bid: Bid): boolean {
    const latestBid = _.head(this.bids);
    const progress = this.bidNumber(bid) > this.bidNumber(latestBid);
    const higherNumber =
      bid.number === latestBid.number && bid.kind > latestBid.kind;
    const possible = this.bidNumber(bid) <= 20;
    return possible && (progress || higherNumber);
  }

  bidNumber(bid: Bid): number {
    // bid.number has special case for -1
    return bid.kind === -1 ? bid.number * 2 - 0.5 : bid.number;
  }

  bid(bid: Bid) {
    if (this.isValidBid(bid)) {
      // make this a latest bid
      this.bids.unshift(bid);
      // turn over
      this.turn = (this.turn + 1) % this.players.length;
    } else {
      console.warn("Invalid bid");
    }
  }

  bluff() {
    const diff = this.diff();
    const turn = this.turn;
    const currentPlayer = this.players[turn];
    const lastPlayer =
      turn === 0 ? _.last(this.players) : this.players[turn - 1];
    if (diff === 0) {
      // all lose 1 except last player
      this.players.forEach(p => {
        if (p !== lastPlayer && p.left !== 0) {
          p.left--;
        }
      });
    } else if (diff > 0) {
      // current player lose diff
      currentPlayer.left -= diff;
      if (currentPlayer.left < 0) {
        currentPlayer.left = 0;
      }
    } else {
      // last player lose diff
      lastPlayer.left -= diff;
      if (lastPlayer.left < 0) {
        lastPlayer.left = 0;
      }

      this.firstTurn = this.players.findIndex(p => p === lastPlayer);
    }
  }

  /**
   * return positive number if more face exist than expected
   */
  diff(): number {
    const bid = _.head(this.bids);
    const { kind, number } = bid;

    const dice = _.flatMap(this.players, p => p.dice);

    const count =
      bid.kind == -1
        ? dice.filter(d => d === -1).length
        : dice.filter(d => d === -1 || d === kind).length;

    return count - number;
  }
}
