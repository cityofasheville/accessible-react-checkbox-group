import React from 'react';
import PropTypes from 'prop-types';

export const CheckboxGroupContext = React.createContext(undefined);

const extractContext = (contextValue, checkboxValue, props) => {
  // For some reason if we destructure values in the params hot reloading doesn't work
  const { name, checkedValues, indeterminateValues, onChange } = contextValue;
  const optional = {};
  if (checkedValues) {
    optional.checked = checkedValues.indexOf(checkboxValue) >= 0;
  }

  if (indeterminateValues) {
    optional.indeterminate = indeterminateValues.indexOf(checkboxValue) >= 0 ? true : undefined;
  }
  if (typeof onChange === 'function') {
    optional.onChange = onChange.bind(null, checkboxValue);
  }

  return { name, optional, ...props };
};

const PreContextualizedCheckbox = ({ value, indeterminate, ...restProps }) => (
  <input
    aria-checked={indeterminate ? 'mixed' : restProps.checked.toString()}
    type="checkbox"
    ref={elem => {
      if (elem) {
        // eslint-disable-next-line no-param-reassign
        elem.indeterminate = indeterminate ? 'true' : undefined;
      }
    }}
    {...restProps}
  />
);

PreContextualizedCheckbox.defaultProps = {
  value: undefined,
  name: undefined,
  checked: false,
  indeterminate: undefined,
  onChange: undefined,
};

PreContextualizedCheckbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  name: PropTypes.string,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
};

export const Checkbox = props => (
  <CheckboxGroupContext.Consumer>
    {value => {
      const { name, optional, ...rest } = extractContext(value, props.value, props);
      return (
        <PreContextualizedCheckbox
          name={name}
          checked={optional.checked}
          indeterminate={optional.indeterminate}
          onChange={optional.onChange}
          {...rest}
        />
      );
    }}
  </CheckboxGroupContext.Consumer>
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
    indeterminateValues: this.props.indeterminateValues,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.checkedValues) {
      this.setState({
        checkedValues: newProps.checkedValues,
      });
    }
    if (newProps.indeterminateValues) {
      this.setState({
        indeterminateValues: newProps.indeterminateValues,
      });
    }
  }

  isControlledComponent = () => Boolean(this.props.checkedValues);

  onCheckboxChange = (checkboxValue, event) => {
    let newValues;
    if (this.state.checkedValues.includes(checkboxValue)) {
      newValues = this.state.checkedValues.filter(v => v !== checkboxValue);
    } else {
      newValues = this.state.checkedValues.concat(checkboxValue);
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

  onCheckboxIndeterminate = (checkboxValue, event) => {
    let newValues;
    if (this.state.indeterminateValues.includes(checkboxValue)) {
      newValues = this.state.indeterminateValues.filter(v => v !== checkboxValue);
    } else {
      newValues = this.state.indeterminateValues.concat(checkboxValue);
    }

    if (this.isControlledComponent()) {
      this.setState({ indeterminateValues: this.props.indeterminateValues });
    } else {
      this.setState({ indeterminateValues: newValues });
    }

    if (typeof this.props.onIndeterminate === 'function') {
      this.props.onIndeterminate(newValues, event, this.props.name);
    }
  };

  createChildren = (values, renderer, providedValue) =>
    values.map((value, index) => {
      let checkboxValue = value;
      let props;
      let label;

      // value may be the direct value or an object with a value prop.
      if (typeof value === 'object') {
        checkboxValue = value.value;
        props = value.props ? value.props : {};
        label = value.label ? value.label : checkboxValue;
      }

      const { name, optional, ...rest } = extractContext(providedValue, checkboxValue, props);

      // label may be a function to return the label string or just the label string
      if (label && {}.toString.call(label) === '[object Function]') {
        label = label();
      } else if (!label) {
        label = checkboxValue;
      }

      const CheckboxComponent = (
        <PreContextualizedCheckbox
          key={[checkboxValue, index].join(' ')}
          name={name}
          checked={optional.checked}
          indeterminate={optional.indeterminate}
          onChange={optional.onChange}
          {...rest}
        />
      );

      return renderer(CheckboxComponent, index, {
        label,
        value: checkboxValue,
        name,
        optional,
        ...props,
      });
    });

  render() {
    const {
      Component,
      name,
      values,
      checkedValues,
      indeterminateValues,
      onChange,
      onIndeterminate,
      children,
      checkboxRenderer,
      ...rest
    } = this.props;

    const providedValue = {
      name,
      checkedValues,
      indeterminateValues,
      onChange: this.onCheckboxChange,
      toggleIndeterminate: this.onCheckboxIndeterminate,
    };

    return (
      <CheckboxGroupContext.Provider value={providedValue}>
        <Component {...rest}>
          {children || this.createChildren(values, checkboxRenderer, providedValue)}
        </Component>
      </CheckboxGroupContext.Provider>
    );
  }
}

// Tbe shape of a checkbox value
const valueShape = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  props: PropTypes.objectOf(PropTypes.any),
};
valueShape.children = PropTypes.arrayOf(PropTypes.shape(valueShape));

CheckboxGroup.defaultProps = {
  name: undefined,
  values: [],
  checkedValues: [],
  indeterminateValues: [],
  onChange: undefined,
  onIndeterminate: undefined,
  children: undefined,
  Component: 'div',
  checkboxRenderer: (CheckboxComponent, index, { value, label }) => (
    <label key={[value, index].join(' ')}>
      {CheckboxComponent} {label}
    </label>
  ),
};

CheckboxGroup.propTypes = {
  name: PropTypes.string,
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.shape(valueShape),
    ])
  ),
  // values: PropTypes.arrayOf(PropTypes.shape(valueShape)),
  checkedValues: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
  ),
  indeterminateValues: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
  ),
  onChange: PropTypes.func,
  onIndeterminate: PropTypes.func,
  children: PropTypes.node,
  Component: PropTypes.node,
  checkboxRenderer: PropTypes.func,
};
