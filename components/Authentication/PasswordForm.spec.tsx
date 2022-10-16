import ProviderWrapper from '@components/Wrappers/ProviderWrapper';
import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

import PasswordForm from './PasswordForm';

test('only password', async ({ mount }) => {
  let password = 'unsafe-password';
  const component = await mount(
    <ProviderWrapper>
      <PasswordForm
        password={password}
        onPasswordChange={(value) => (password = value)}
      />
    </ProviderWrapper>
  );
  const form = component.locator('_react=PasswordForm');
  await expect(form).toHaveScreenshot();
  await form.locator('data-testid=password').fill('safe-password');
  expect(password).toEqual('safe-password');
});

test('required', async ({ mount }) => {
  const component = await mount(
    <ProviderWrapper>
      <PasswordForm
        required
        password="unsafe-password"
        onPasswordChange={() => {}}
      />
    </ProviderWrapper>
  );
  const form = component.locator('_react=PasswordForm');
  await expect(form).toHaveScreenshot();
});

test('old password', async ({ mount }) => {
  let oldPassword = 'safe-password',
    oldPasswordError = true;
  const component = await mount(
    <ProviderWrapper>
      <PasswordForm
        required
        showValidation
        showOldPassword
        oldPasswordError={oldPasswordError}
        oldPassword={oldPassword}
        password="unsafe-password"
        onPasswordChange={() => {}}
        setOldPasswordError={(value) => (oldPasswordError = value)}
        onOldPasswordChange={(value) => (oldPassword = value)}
      />
    </ProviderWrapper>
  );
  const form = component.locator('_react=PasswordForm');
  await expect(form).toHaveScreenshot();
  await form.locator('data-testid=oldPassword').type('.');
  await expect(form).toHaveScreenshot();
});
