import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

(async () => {
  const startingBalance = stdlib.parseCurrency(10);
  const accAlice = await stdlib.newTestAccount(startingBalance);
  const accBob = await stdlib.newTestAccount(startingBalance);

  const ctcAlice = accAlice.deploy(backend);
  const ctcBob = accBob.attach(backend, ctcAlice.getInfo());

  const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];
  const Player = (Who) => ({
    getNum: () => {
      const num = Math.floor(Math.random() * 100);
      console.log(`${Who} got ${num}`);
      return num;
    },
    seeOutcome: (outcome) => {
      console.log(`${Who} got ${OUTCOME[outcome]}`);
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
})();