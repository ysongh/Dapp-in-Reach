import React from 'react';
import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from '../build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];

class App extends React.Component {
  state = {
    msg: '',
    scores: []
  }

  async componentDidMount() {
    const startingBalance = stdlib.parseCurrency(10);
    const accAlice = await stdlib.newTestAccount(startingBalance);
    const accBob = await stdlib.newTestAccount(startingBalance);

    const ctcAlice = accAlice.deploy(backend);
    const ctcBob = accBob.attach(backend, ctcAlice.getInfo());

    const Player = (Who) => ({
      getNum: () => {
        const num = Math.floor(Math.random() * 100);
        console.log(`${Who} got ${num}`);
        this.setState({ scores: [...this.state.scores, `${Who} got ${num}`]})
        return num;
      },
      seeOutcome: (outcome) => {
        console.log(`${Who} got ${OUTCOME[outcome]}`);
        this.setState({ msg: `${Who} got ${OUTCOME[outcome]}`})
      },
    });

    await Promise.all([
      backend.Alice(ctcAlice, {
        ...Player('Alice'),
      }),
      backend.Bob(ctcBob, {
        ...Player('Bob'),
      }),
    ]);
  }

  render() {
    return (
      <div>
        <h1>Result</h1>
        {this.state.scores.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
        <p>{this.state.msg}</p>
      </div>
    );
  }
}

export default App;