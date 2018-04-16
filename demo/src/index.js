import React, { Component } from 'react';
import { render } from 'react-dom';
import { CheckboxGroup, Checkbox, LabelledCheckbox } from '../../src';

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
          name="fruits"
          checkedValues={this.state.fruits}
          onChange={this.fruitsChanged}
          // Component="fieldset"
        >
          {/* <legend>Fruit Selection</legend> */}
          <LabelledCheckbox value="apple" label=" Apple" />
          <label htmlFor="orange-checkbox"><Checkbox id="orange-checkbox" value="orange" /> Orange</label>
          <label htmlFor="watermelon-checkbox"><Checkbox id="watermelon-checkbox" value="watermelon" /> Watermelon</label>
        </CheckboxGroup>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
