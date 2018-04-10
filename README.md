# accessible-react-checkbox-group

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A higher order component that adds accessibility features to [react-checkbox-group](https://github.com/ziad-saab/react-checkbox-group).

## Usage
The simplest usage to just replace `CheckboxGroup` with `AccessibleCheckboxGroup` and `Checkbox` with
`AccessibleCheckbox`. You will need the following import.
```js
import { AccessibleCheckboxGroup, AccessibleCheckbox } from 'accessible-react-checkbox-group';
```

However, as this was developed as a higher order component, you can also use it as such.
```js
import { CheckboxGroup, Checkbox } from 'react-checkbox-group';
import { checkboxGroupAccessibility, checkboxAccessibility } from 'accessible-react-checkbox-group';

const AccessibleCheckboxGroup = checkboxGroupAccessibility(CheckboxGroup);
const AccessibleCheckbox = checkboxAccessibility(Checkbox);
```

[build-badge]: https://img.shields.io/travis/dumptruckman/accessible-react-checkbox-group/master.png?style=flat-square
[build]: https://travis-ci.org/dumptruckman/accessible-react-checkbox-group

[npm-badge]: https://img.shields.io/npm/v/accessible-react-checkbox-group.png?style=flat-square
[npm]: https://www.npmjs.org/package/accessible-react-checkbox-group

[coveralls-badge]: https://img.shields.io/coveralls/dumptruckman/accessible-react-checkbox-group/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/dumptruckman/accessible-react-checkbox-group
