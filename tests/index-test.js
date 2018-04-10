import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { AccessibleCheckboxGroup } from '../src/';

describe('AccessibleReactTable', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it('displays a welcome message', () => {
    render(<AccessibleCheckboxGroup />, node, () => {
      expect(node.innerHTML).toContain('Welcome to React components');
    });
  });
});
