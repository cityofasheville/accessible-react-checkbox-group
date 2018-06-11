import React from 'react';
import PropTypes from 'prop-types';

export const CheckboxGroupContext = React.createContext(undefined);

/**
 * Extracts checkbox group context information for a given checkbox value into a normal props object.
 *
 * @param {{name: string, checkedValues: array.<CheckboxValue>, indeterminateValues: array.<CheckboxValue>, onChange: Function}} contextValue - The context information to extract.
 * @param {CheckboxValue} checkboxValue - The value of the checkbox to extract context for.
 * @param {object} props - Normal props to pass to the individual checkbox.
 * @returns {ExtractedContext}
 */
const extractContext = (contextValue, checkboxValue, props) => {
  // For some reason if we destructure values in the params hot reloading doesn't work
  const { name, checkedValues, indeterminateValues, onChange } = contextValue;

  const options = {};
  if (checkedValues) {
    options.checked = checkedValues.indexOf(checkboxValue) >= 0;
  }
  if (indeterminateValues) {
    options.indeterminate = indeterminateValues.indexOf(checkboxValue) >= 0 ? true : undefined;
  }
  if (typeof onChange === 'function') {
    options.onChange = onChange.bind(null, checkboxValue);
  }

  return { name, options, ...props };
};

/**
 * A simple stateless functional component that renders a checkbox.
 *
 * @param {Object} props - The props object for the component.
 * @param {CheckboxValue} props.value - The value of the checkbox.
 * @param {boolean} props.indeterminate - Whether or not the checkbox is indeterminate.
 * @param {...Object} props.restProps - Any additional props for the checkbox input element.
 * @constructor
 */
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

/**
 * The primary Checkbox component.
 * This can be used used manually within a {@link CheckboxGroup} or can be auto generated using a childless {@link CheckboxGroup}.
 *
 * @param {Object} props - The props object for the component.
 * @param {CheckboxValue} props.value - The value of the checkbox.
 * @param {...Object} props.restProps - Any additional props for the checkbox input element.
 * @constructor
 */
export const Checkbox = props => (
  <CheckboxGroupContext.Consumer>
    {value => {
      const { name, options, ...rest } = extractContext(value, props.value, props);
      return (
        <PreContextualizedCheckbox
          name={name}
          checked={options.checked}
          indeterminate={options.indeterminate}
          onChange={options.onChange}
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

/**
 * A component for grouping checkboxes into a shared purpose.
 */
export class CheckboxGroup extends React.Component {
  /**
   * The state of this CheckboxGroup.
   * @type {{checkedValues: array.<CheckboxValue>, indeterminateValues: array.<CheckboxValue>}}
   */
  state = {
    checkedValues: this.props.checkedValues,
    // eslint-disable-next-line
    indeterminateValues: this.props.indeterminateValues,
  };

  componentWillReceiveProps(newProps) {
    // Update this component's state with the checked/indeterminate status of each checkbox.
    if (newProps.checkedValues) {
      this.setState({
        checkedValues: newProps.checkedValues,
      });
    }
    if (newProps.indeterminateValues) {
      this.setState({
        // eslint-disable-next-line
        indeterminateValues: newProps.indeterminateValues,
      });
    }
  }

  /**
   * Tells whether this component is being fed in checked values externally.
   *
   * @returns {boolean} True if the checked values are being passed into this CheckboxGroup.
   */
  isControlledComponent = () => Boolean(this.props.checkedValues);

  /**
   * The change handler for when any of this group's checkboxes change state.
   *
   * @param {CheckboxValue} checkboxValue - The checkbox value that has changed.
   * @param {Event} event - The javascript event created for the checkbox state change.
   */
  onCheckboxChange = (checkboxValue, event) => {
    let newValues;
    // Remove the value from checkedValues if was checked or add it if not checked.
    if (this.state.checkedValues.includes(checkboxValue)) {
      newValues = this.state.checkedValues.filter(v => v !== checkboxValue);
    } else {
      newValues = this.state.checkedValues.concat(checkboxValue);
    }

    if (this.isControlledComponent()) {
      // The state will reflect checked values passed from props at all times.
      this.setState({ checkedValues: this.props.checkedValues });
    } else {
      this.setState({ checkedValues: newValues });
    }

    if (typeof this.props.onChange === 'function') {
      // The checkbox group was provided an onChange function so this calls that.
      this.props.onChange(newValues, event, this.props.name);
    }
  };

  /**
   * Creates a tree of child checkbox elements based on an array of values.
   *
   * @param {array.<(CheckboxValue|CheckboxValueObject)>} values - The array of values to render as checkboxes.
   * @param renderer - The checkbox renderer to use.
   * @param providedValue - The context value to use for each checkbox.
   * @returns A renderable tree of checkbox components.
   */
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

      const { name, options, ...rest } = extractContext(providedValue, checkboxValue, props);

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
          checked={options.checked}
          indeterminate={options.indeterminate}
          onChange={options.onChange}
          {...rest}
        />
      );

      return renderer(CheckboxComponent, index, {
        label,
        value: checkboxValue,
        name,
        options,
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
      // onChange doesn't get put into use here
      onChange,
      children,
      checkboxRenderer,
      ...rest
    } = this.props;

    // These are the values passed through context.
    const providedValue = {
      name,
      checkedValues,
      indeterminateValues,
      onChange: this.onCheckboxChange,
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
valueShape.children = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.shape(valueShape),
  ])
);

CheckboxGroup.defaultProps = {
  name: undefined,
  /**
   * @type {array.<(CheckboxValue|CheckboxValueObject)>}
   */
  values: [],
  /**
   * @type {array.<CheckboxValue>}
   */
  checkedValues: [],
  /**
   * @type {array.<CheckboxValue>}
   */
  indeterminateValues: [],
  onChange: undefined,
  children: undefined,
  Component: 'div',
  /**
   *
   * @param {React.Component} CheckboxComponent - The actual checkbox component to be rendered.
   * @param {number} index - The index derived from the map function.
   * @param {Object} props - The props of the checkbox.
   * @param {CheckboxValue} props.value - The value of the checkbox.
   * @param {React.Component | Function} props.label - the label to be rendered.
   * @param {string} props.name - The name of the checkbox group.
   * @param {CheckboxOptions} props.options - The natural attributes of a checkbox input.
   * @param (...Object} props.rest - The remaining props of the checkbox.
   * @returns {React.Component} A renderable checkbox.
   */
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
  checkedValues: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
  ),
  indeterminateValues: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
  ),
  onChange: PropTypes.func,
  children: PropTypes.node,
  Component: PropTypes.node,
  checkboxRenderer: PropTypes.func,
};

/**
 * @typedef {(string|number|boolean)} CheckboxValue
 */

/**
 * @typedef {Object} CheckboxValueObject
 * @property {CheckboxValue} value - The actual value of the checkbox.
 * @property {React.Component | Function} label - The label to be associate with the checkbox.
 * @property {Object} props - The component props for the checkbox.
 * @property {?array.<(CheckboxValue|CheckboxValueObject)>} children - An optional child array of values.
 */

/**
 * @typedef {Object} CheckboxOptions
 * @property {?boolean} checked - Whether or not the checkbox is checked.
 * @property {?boolean} indeterminate - Whether or not the checkbox is indeterminate.
 * @property {?Function} onChange - The function to call when the checkbox input changes state.
 */

/**
 * @typedef {Object} ExtractedContext
 * @property {string} name - The name of the checkbox group.
 * @property {CheckboxOptions} options - The natural attributes of a checkbox input.
 * @property {...*} props - Any additional props to pass to a checkbox input.
 */
