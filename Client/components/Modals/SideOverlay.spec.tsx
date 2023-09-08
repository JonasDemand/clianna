import ProviderWrapper from '@components/Wrappers/ProviderWrapper';
import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

import SideOverlay from './SideOverlay';

test('open', async ({ mount, page }) => {
  await mount(
    <ProviderWrapper>
      <SideOverlay
        heading="test :)"
        open={true}
        onClose={() => {}}
        onSave={() => {}}
      >
        lorem ipsum
      </SideOverlay>
    </ProviderWrapper>
  );
  await expect(page).toHaveScreenshot();
});
