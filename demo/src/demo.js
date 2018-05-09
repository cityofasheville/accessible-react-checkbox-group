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
      <form>
        <h1>accessible-react-checkbox-group Demo</h1>
        <CheckboxGroup
          name="fruits"
          checkedValues={this.state.fruits}
          onChange={this.fruitsChanged}
          Component="fieldset"
        >
          <legend>Fruit Selection</legend>
          <label><Checkbox value="apple" /> Apple</label>
          <label><Checkbox value="orange" /> Orange</label>
          <label><Checkbox value="watermelon" /> Watermelon</label>
        </CheckboxGroup>
      </form>
    );
  }
}

render(<Demo />, document.getElementById('app'));
