import React from 'react';

// Simple smoke test - just verify React and testing environment work
test('React environment works', () => {
  const element = React.createElement('div', { 'data-testid': 'test' }, 'Hello');
  expect(element).toBeDefined();
  expect(element.type).toBe('div');
  expect((element.props as any).children).toBe('Hello');
});

test('Basic Jest functionality works', () => {
  expect(1 + 1).toBe(2);
  expect('hello').toBe('hello');
  expect([1, 2, 3]).toHaveLength(3);
});
