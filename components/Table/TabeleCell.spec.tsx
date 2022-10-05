import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

import TableCell from './TableCell';

test('without search', async ({ mount }) => {
  const component = await mount(<TableCell search="" value="lorem ipsum" />);
  await expect(component).toHaveScreenshot();
});

test('with search', async ({ mount }) => {
  const component = await mount(
    <TableCell search="lorem ipsum" value="lorem 123 ipsum" />
  );
  await expect(component).toHaveScreenshot();
});

test('tooltip', async ({ mount, page }) => {
  const component = await mount(<TableCell search="" value="lorem ipsum" />);
  await component.hover();
  await expect(page).toHaveScreenshot();
});

test('link', async ({ mount }) => {
  const component = await mount(
    <TableCell search="" value="https://google.com" />
  );
  await expect(component).toHaveScreenshot();
});
