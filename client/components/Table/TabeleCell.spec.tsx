import ProviderWrapper from '@components/Wrappers/ProviderWrapper';
import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

import TableCell from './TableCell';

test('text', async ({ mount }) => {
  const component = await mount(
    <ProviderWrapper>
      <TableCell search="" value="lorem ipsum" />
    </ProviderWrapper>
  );
  await expect(component).toHaveText('lorem ipsum');
});

test('without search', async ({ mount }) => {
  const component = await mount(
    <ProviderWrapper>
      <TableCell search="" value="lorem ipsum" />
    </ProviderWrapper>
  );
  const tablecell = component.locator('_react=TableCell');
  await expect(tablecell).toHaveScreenshot();
});

test('with search', async ({ mount }) => {
  const component = await mount(
    <ProviderWrapper>
      <TableCell search="lorem ipsum" value="lorem 123 ipsum" />
    </ProviderWrapper>
  );
  const tablecell = component.locator('_react=TableCell');
  await expect(tablecell).toHaveScreenshot();
});

test('tooltip', async ({ mount, page }) => {
  const component = await mount(
    <ProviderWrapper>
      <TableCell search="" value="lorem ipsum" />
    </ProviderWrapper>
  );
  const tablecell = component.locator('_react=TableCell');
  await tablecell.hover();
  await expect(page).toHaveScreenshot();
});

test('link', async ({ mount, context }) => {
  const component = await mount(
    <ProviderWrapper>
      <TableCell search="" value="https://www.google.com/" />
    </ProviderWrapper>
  );
  const tablecell = component.locator('_react=TableCell');
  await expect(tablecell).toHaveScreenshot();
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    await tablecell.click(),
  ]);
  await expect(newPage).toHaveURL('https://www.google.com/');
});
