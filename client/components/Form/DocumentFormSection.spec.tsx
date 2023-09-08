import ProviderWrapper from '@components/Wrappers/ProviderWrapper';
import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

import DocumentFormSection from './DocumentFormSection';

test('without session', async ({ mount }) => {
  const component = await mount(
    <ProviderWrapper>
      <DocumentFormSection
        documents={[]}
        templates={[]}
        reference={{}}
        onUpdate={() => {}}
      />
    </ProviderWrapper>
  );
  await expect(component).toHaveScreenshot();
});
