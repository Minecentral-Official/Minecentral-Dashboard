import { expect, test } from '@playwright/test';

test('explain conflicting evidence, fix a missing dependency, and submit and withdraw an opt-in report', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: `tests/.auth/compatibility-${testInfo.project.name}.json`,
    viewport:
      testInfo.project.name === 'mobile' ?
        { width: 393, height: 851 }
      : { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const name = `Compatibility ${testInfo.project.name}`;
  await page.goto('/servers/new');
  await page
    .getByRole('textbox', { name: 'Server name', exact: true })
    .fill(name);
  await page
    .getByRole('button', { name: 'Create workspace', exact: true })
    .click();
  await expect(page).toHaveURL(/\/servers\/[0-9a-f-]{36}$/);
  const base = page.url();
  await page.goto('/discover/plugins');
  await page
    .getByRole('link', { name: /Add to a workspace Cedar Resolver/ })
    .click();
  await page.getByRole('link', { name: new RegExp(name) }).click();
  await page
    .getByRole('combobox', { name: 'Installed version', exact: true })
    .selectOption({ label: 'Cedar 1.0 · modrinth · declared support' });
  await page.getByRole('button', { name: 'Add to stack', exact: true }).click();
  await expect(page).toHaveURL(`${base}/stack`);
  await page.goto(`${base}/compatibility`);
  await expect(
    page.getByRole('heading', { name: 'Action required', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Evidence disagrees', { exact: true }).last(),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('compatibility.png'),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('link', { name: 'Add dependency', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Installed version', exact: true })
    .selectOption({ label: 'Oak 1.0 · modrinth · declared support' });
  await page.getByRole('button', { name: 'Add to stack', exact: true }).click();
  await expect(page).toHaveURL(`${base}/stack`);
  await page.goto(`${base}/compatibility`);
  await expect(
    page.getByRole('heading', { name: 'Action required', exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Recheck compatibility', exact: true })
    .click();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Compatibility report recomputed.' }),
  ).toBeVisible();
  await page.goto(`${base}/stack`);
  await page
    .getByRole('heading', { name: 'Cedar Resolver', exact: true })
    .getByRole('link')
    .click();
  await page
    .getByText('Share a community test report', { exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole('textbox', { name: 'Test details', exact: true })
    .fill(
      `Synthetic browser test ${testInfo.project.name}: clean server started with this exact release.`,
    );
  await page
    .getByLabel('Test date', { exact: true })
    .fill(new Date().toISOString().slice(0, 10));
  await page.getByRole('checkbox', { name: /I opt in to sharing/ }).check();
  await page
    .getByRole('button', { name: 'Submit test report', exact: true })
    .click();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Report submitted for review.' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Manage my reports', exact: true })
    .click();
  await expect(
    page.getByText(/paper \/ 1.21.11 · compatible · pending/),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Withdraw report', exact: true })
    .click();
  await expect(
    page.getByText(/paper \/ 1.21.11 · compatible · withdrawn/),
  ).toBeVisible();
  await expect(page.getByText(/Synthetic browser test/)).toHaveCount(0);
  await page.goto(`${base}/stack`);
  for (const plugin of ['Cedar Resolver', 'Oak Permissions']) {
    await page
      .getByRole('heading', { name: plugin, exact: true })
      .getByRole('link')
      .click();
    await page
      .getByText('Remove plugin', { exact: true })
      .filter({ visible: true })
      .click();
    await page
      .getByRole('checkbox', {
        name: 'I confirm removal of this entry and its private notes.',
        exact: true,
      })
      .check();
    await page.getByRole('button', { name: 'Remove from stack' }).click();
    await expect(page).toHaveURL(`${base}/stack`);
  }
  await page.goto(`${base}/settings`);
  await page
    .getByRole('button', { name: 'Archive workspace', exact: true })
    .click();
  await page.getByLabel(`Type “${name}” to confirm`).fill(name);
  await page
    .getByRole('button', { name: 'Permanently delete workspace', exact: true })
    .click();
  await expect(page).toHaveURL(/\/servers\?archived=true$/);
  await context.close();
});
