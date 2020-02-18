import React from 'react';
import FormComponent from './components/form'
import Submit from './components/submit'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
             <Switch>
          <Route path="/success">
            <Submit />
          </Route>
          <Route path="/">
          <FormComponent />
          </Route>
        </Switch>
    </Router>
      </div>
  );
}

export default App;
