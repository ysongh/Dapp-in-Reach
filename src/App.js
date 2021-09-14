import React from 'react';
import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from '../build/index.main.mjs';
const reach = loadStdlib(process.env);

class App extends React.Component {
  render() {
    return <div>
      Hello
    </div>;
  }
}

export default App;