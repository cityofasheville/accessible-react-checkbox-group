import React from 'react';
import PropTypes from 'prop-types';
import namor from 'namor';

const { Provider, Consumer } = React.createContext();

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

export const LabelledCheckbox = (props) => {
  const { id, label, value, render, ...rest } = props;
  let realId = id;
  if (!id) {
    realId = namor.generate({ words: 2 });
  }

  // const checkbox = <label htmlFor={realId}><Checkbox id={realId} value {...rest} />{(label || value) || ''}</label>;
  //
  // return render(checkbox);
  return (
    <div style={{ margin: '6px 0' }}>
      <Checkbox id={realId} value={value} {...rest} />
      <label style={{ display: 'inline-block', width: '120px', verticalAlign: 'top' }} htmlFor={realId}>{(label || value) || ''}</label>
    </div>
  );
};

LabelledCheckbox.defaultProps = {
  id: undefined,
  label: undefined,
  value: undefined,
  render: checkbox => <div>{checkbox}</div>,
};

LabelledCheckbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  render: PropTypes.func,
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
