# accessible-react-checkbox-group

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## About
This is a remake of [react-checkbox-group](https://github.com/ziad-saab/react-checkbox-group)
that adds full accessibility support. Some other issues are also fixed,
such as using React's context API for efficiency and to allow for HOCs.

## Reasoning

This is your average checkbox group:

```html
<form>
  <input onChange={this.handleFruitChange} type="checkbox" name="fruit" value="apple" />Apple
  <input onChange={this.handleFruitChange} type="checkbox" name="fruit" value="orange" />Orange
  <input onChange={this.handleFruitChange} type="checkbox" name="fruit" value="watermelon" />Watermelon
</form>
```

Repetitive, hard to manipulate and easily desynchronized.
Lift up `name` and `onChange`, and give the group an initial checked values array:

```javascript
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

<CheckboxGroup name="fruits" checkedValues={['kiwi', 'pineapple']} onChange={this.fruitsChanged}>
  <Checkbox value="kiwi"/>
  <Checkbox value="pineapple"/>
  <Checkbox value="watermelon"/>
</CheckboxGroup>
```

Listen for changes, get the new value as intuitively as possible:

```javascript
<CheckboxGroup name="fruit" checkedValues={['apple','watermelon']} onChange={this.handleChange}>
...
</CheckboxGroup>
```

and further

```javascript
function handleChange(newValues) {
  // ['apple']
}
```

That's it for the API! See below for a complete example.

## Install

```sh
bower install accessible-react-checkbox-group
```

or

```sh
npm install accessible-react-checkbox-group
```

Simply require/import it to use it:

```javascript
var Check = require('accessible-react-checkbox-group');
var Checkbox = Check.Checkbox;
var CheckboxGroup = Check.CheckboxGroup;

// or ES6
import {Checkbox, CheckboxGroup} from 'accessible-react-checkbox-group';
```

## Nested `Checkbox`
If you render `Checkbox`es deeply nested inside the `CheckboxGroup`, you need to pass a `checkboxDepth` prop to the `CheckboxGroup` so that it can manage the checkboxes without too much overhead.

This is shown in the example below where the `<Checkbox>` elements are nested inside `<label>`s.

## Example

```javascript
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fruits: ['apple','watermelon']
    };
  }

  componentDidMount() {
    // Add orange and remove watermelon after 5 seconds
    setTimeout(() => {
      this.setState({
        fruits: ['apple','orange']
      });
    }, 5000);
  }

  render() {
    // the checkboxes can be arbitrarily deep. They will always be fetched and
    // attached the `name` attribute correctly. `checkedValues` is optional
    return (
      <CheckboxGroup
        name="fruits"
        checkedValues={this.state.fruits}
        onChange={this.fruitsChanged}>

        <label htmlFor="apple-checkbox"><Checkbox id="apple-checkbox" value="apple" /> Apple</label>
        <label htmlFor="orange-checkbox"><Checkbox id="orange-checkbox" value="orange" /> Orange</label>
        <label htmlFor="watermelon-checkbox"><Checkbox id="watermelon-checkbox" value="watermelon" /> Watermelon</label>
      </CheckboxGroup>
    );
  }

  fruitsChanged = (newFruits) => {
    this.setState({
      fruits: newFruits
    });
  }

};

ReactDOM.render(<Demo/>, document.body);
```

[build-badge]: https://img.shields.io/travis/dumptruckman/accessible-react-checkbox-group/master.png?style=flat-square
[build]: https://travis-ci.org/dumptruckman/accessible-react-checkbox-group

[npm-badge]: https://img.shields.io/npm/v/accessible-react-checkbox-group.png?style=flat-square
[npm]: https://www.npmjs.org/package/accessible-react-checkbox-group

[coveralls-badge]: https://img.shields.io/coveralls/dumptruckman/accessible-react-checkbox-group/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/dumptruckman/accessible-react-checkbox-group
