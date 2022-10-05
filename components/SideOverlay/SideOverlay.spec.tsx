import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

import SideOverlay from './SideOverlay';

test('open', async ({ mount, page }) => {
  const component = await mount(
    <SideOverlay
      heading="test :)"
      open={true}
      onClose={() => {}}
      onSave={() => {}}
    >
      lorem ipsum
    </SideOverlay>
  );
  await expect(page).toHaveScreenshot();
});
