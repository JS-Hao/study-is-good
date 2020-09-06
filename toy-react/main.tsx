import { Component, render } from "./toy-react";

class App extends Component {
  render() {
    return (
      <Father>
        <Son>i am son</Son>
      </Father>
    );
  }
}

class Father extends Component {
  render() {
    return <div>i am Father{this.children}</div>;
  }
}

class Son extends Component {
  render() {
    return <span>{this.children}</span>;
  }
}

render(<App />, document.querySelector("#root"));
