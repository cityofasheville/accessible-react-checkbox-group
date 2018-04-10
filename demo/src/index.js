import React, { Component } from 'react';
import { render } from 'react-dom';
import { CheckboxGroup, Checkbox } from '../../src';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fruits: ['apple', 'watermelon'],
    };
  }

  componentDidMount() {
    // Add orange and remove watermelon after 5 seconds
    setTimeout(() => {
      this.setState({
        fruits: ['apple', 'orange'],
      });
    }, 5000);
  }

  fruitsChanged = (newFruits) => {
    this.setState({
      fruits: newFruits,
    });
  };

  render() {
    return (
      <div>
        <h1>accessible-react-checkbox-group Demo</h1>
        <CheckboxGroup
          checkboxDepth={2} // This is needed to optimize the checkbox group
          name="fruits"
          value={this.state.fruits}
          onChange={this.fruitsChanged}
        >
          <label><Checkbox value="apple" disabled /> Apple</label>
          <label><Checkbox value="orange" /> Orange</label>
          <label><Checkbox value="watermelon" /> Watermelon</label>
        </CheckboxGroup>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
