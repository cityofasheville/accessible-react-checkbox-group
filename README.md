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
import {Checkbox, CheckboxGroup} from 'accessible-react-checkbox-group';

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

## How to Contribute
Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for information on contributing.

[build-badge]: https://img.shields.io/travis/dumptruckman/accessible-react-checkbox-group/master.png?style=flat-square
[build]: https://travis-ci.org/dumptruckman/accessible-react-checkbox-group

[npm-badge]: https://img.shields.io/npm/v/accessible-react-checkbox-group.png?style=flat-square
[npm]: https://www.npmjs.org/package/accessible-react-checkbox-group

[coveralls-badge]: https://img.shields.io/coveralls/dumptruckman/accessible-react-checkbox-group/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/dumptruckman/accessible-react-checkbox-group
