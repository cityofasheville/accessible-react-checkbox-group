import React, { Component } from "react";
import { render } from "react-dom";
import { CheckboxGroup, Checkbox } from "../../src";

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fruits: ["all", "apple", "watermelon"],
      // indeterminates must be specified initially since the group component does not know all possible values
      indeterminates: ["all"]
    };
  }

  componentDidMount() {
    // Add orange and remove watermelon after 5 seconds
    setTimeout(() => {
      this.setState({
        fruits: ["all", "apple", "orange"],
        indeterminates: ["all"]
      });
    }, 5000);
  }

  fruitsChanged = newFruits => {
    let f = newFruits.filter(e => e !== "all");
    let indeterminates = [];

    if (!this.state.fruits.includes("all") && newFruits.includes("all")) {
      f = ["apple", "orange", "watermelon", "all"];
    } else if (
      this.state.fruits.includes("all") &&
      !newFruits.includes("all")
    ) {
      f = [];
    } else if (
      f.includes("apple") &&
      f.includes("orange") &&
      f.includes("watermelon")
    ) {
      f = [...f, "all"];
    } else if (
      f.includes("apple") ||
      f.includes("orange") ||
      f.includes("watermelon")
    ) {
      f = [...f, "all"];
      indeterminates = ["all"];
    }

    this.setState({
      fruits: f,
      indeterminates
    });
  };

  render() {
    return (
      <form>
        <h1>accessible-react-checkbox-group Demo</h1>

        <CheckboxGroup
          name="fruits"
          checkedValues={this.state.fruits}
          indeterminateValues={this.state.indeterminates}
          onChange={this.fruitsChanged}
          Component="fieldset"
        >
          <legend>Classic Fruit Selection</legend>
          <label>
            <Checkbox value="all" /> All
          </label>
          <label>
            <Checkbox value="apple" /> Apple
          </label>
          <label>
            <Checkbox value="orange" /> Orange
          </label>
          <label>
            <Checkbox value="watermelon" /> Watermelon
          </label>
        </CheckboxGroup>

        <CheckboxGroup
          name="fruits2"
          values={[
            {
              value: "all",
              label: "All",
              props: {
                disabled: true
              }
            },
            {
              value: "apple",
              label: "Apple"
            },
            {
              value: "orange",
              label: "Orange"
            },
            "watermelon"
          ]}
          checkedValues={this.state.fruits}
          indeterminateValues={this.state.indeterminates}
          onChange={this.fruitsChanged}
          Component="fieldset"
          checkboxRenderer={(
            CheckboxComponent,
            index,
            { value, label, optional }
          ) => (
            <div
              key={[value, index].join(" ")}
              style={{
                border: "1px solid black",
                backgroundColor: optional.checked ? "lightblue" : "grey"
              }}
            >
              <label>
                <CheckboxComponent /> {label}
              </label>
            </div>
          )}
          groupRenderer={(GroupComponent, props) => (
            <GroupComponent>
              <legend>Render Props Fruit Selection</legend>
              {props.children}
            </GroupComponent>
          )}
        />
      </form>
    );
  }
}

render(<Demo />, document.getElementById("app"));
