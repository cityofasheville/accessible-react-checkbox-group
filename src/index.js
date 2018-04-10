import React from 'react';
import PropTypes from 'prop-types';

export class Checkbox extends React.Component {
  render() {
    const { name, checkedValues, onChange } = this.context.checkboxGroup;
    const optional = {};
    if (checkedValues) {
      optional.checked = (checkedValues.indexOf(this.props.value) >= 0);
    }
    if (typeof onChange === 'function') {
      optional.onChange = onChange.bind(null, this.props.value);
    }

    return (
      <input
        {...this.props}
        type="checkbox"
        aria-checked={optional.checked}
        name={name}
        {...optional}
      />
    );
  }
}

Checkbox.defaultProps = {
  value: undefined,
};

Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

Checkbox.contextTypes = {
  radioGroup: PropTypes.object,
};

export class CheckboxGroup extends React.Component {
  getChildContext() {
    const { name, checkedValues } = this.props;
    return {
      checkboxGroup: {
        name,
        checkedValues,
        onChange: this.onCheckboxChange,
      },
    };
  }

  state = {
    checkedValues: this.props.checkedValues,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.value) {
      this.setState({
        value: newProps.value,
      });
    }
  }

  render() {
    const {
      Component, name, checkedValues, onChange, children, ...rest
    } = this.props;
    return <Component role="group" {...rest}>{children}</Component>;
  }

  getValue = () => this.state.value;

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
  Component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
};

CheckboxGroup.childContextTypes = {
  checkboxGroup: PropTypes.object,
};
