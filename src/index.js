import React from 'react';
import PropTypes from 'prop-types';

export const CheckboxGroupContext = React.createContext();

const { Provider, Consumer } = CheckboxGroupContext;

export const Checkbox = props => (
  <Consumer>
    {({ name, checkedValues, onChange }) => {
      const optional = {};
      if (checkedValues) {
        optional.checked = (checkedValues.indexOf(props.value) >= 0);
      }
      if (typeof onChange === 'function') {
        optional.onChange = onChange.bind(null, props.value);
      }
      return (<input
        {...props}
        type="checkbox"
        name={name}
        {...optional}
      />);
    }}

  </Consumer>
);

Checkbox.defaultProps = {
  value: undefined,
};

Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

export class CheckboxGroup extends React.Component {
  state = {
    checkedValues: this.props.checkedValues,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.checkedValues) {
      this.setState({
        checkedValues: newProps.checkedValues,
      });
    }
  }

  isControlledComponent = () => Boolean(this.props.checkedValues);

  onCheckboxChange = (checkboxValue, event) => {
    let newValues;
    if (event.target.checked) {
      newValues = this.state.checkedValues.concat(checkboxValue);
    } else {
      newValues = this.state.checkedValues.filter(v => v !== checkboxValue);
    }

    if (this.isControlledComponent()) {
      this.setState({ checkedValues: this.props.checkedValues });
    } else {
      this.setState({ checkedValues: newValues });
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(newValues, event, this.props.name);
    }
  };

  render() {
    const { Component, name, checkedValues, onChange, children, ...rest } = this.props;

    return (
      <Provider value={{ name, checkedValues, onChange: this.onCheckboxChange }}>
        <Component role="group" {...rest}>{children}</Component>
      </Provider>
    );
  }
}

CheckboxGroup.defaultProps = {
  name: undefined,
  checkedValues: [],
  onChange: undefined,
  Component: 'div',
};

CheckboxGroup.propTypes = {
  name: PropTypes.string,
  checkedValues: PropTypes.arrayOf(PropTypes.string, PropTypes.number, PropTypes.bool),
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  Component: PropTypes.element,
};
