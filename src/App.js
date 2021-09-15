import React from 'react';
import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from '../build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];

class App extends React.Component {
  state = {
    balance: 0,
    scores: [],
    msg: [],
    ctcAlice: null,
    ctcBob: null
  }

  async componentDidMount() {
    const acc = await stdlib.getDefaultAccount();
    const balAtomic = await stdlib.balanceOf(acc);
    this.setState({ balance: balAtomic.toString() });

    const ctcAlice = await acc.deploy(backend);
    const ctcBob = await acc.attach(backend, ctcAlice.getInfo());

    this.setState({
      ctcAlice: ctcAlice,
      ctcBob: ctcBob
    });
  }

  async playGame() {
    const Player = (Who) => ({
      getNum: () => {
        const num = Math.floor(Math.random() * 100);
        console.log(`${Who} got ${num}`);
        this.setState({ scores: [...this.state.scores, `${Who} got ${num}`]})
        return num;
      },
      seeOutcome: (outcome) => {
        console.log(`${Who} got ${OUTCOME[outcome]}`);
        this.setState({ msg: [...this.state.msg, `${Who} got ${OUTCOME[outcome]}`] })
      },
    });

    await Promise.all([
      backend.Alice(this.state.ctcAlice, {
        ...Player('Alice'),
      }),
      backend.Bob(this.state.ctcBob, {
        ...Player('Bob'),
      }),
    ]);
  }

  render() {
    return (
      <div>
        <h1>Result</h1>
        <p>{this.state.balance / 10 ** 18} ETH</p>
        <button onClick={this.playGame.bind(this)}>Play</button>
        {this.state.scores.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
        {this.state.msg.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </div>
    );
  }
}

export default App;