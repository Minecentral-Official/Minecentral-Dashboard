import { expect, test } from '@playwright/test';

test('record a stack from the catalog, edit versions and private notes, import and remove', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: `tests/.auth/stack-${testInfo.project.name}.json`,
    viewport:
      testInfo.project.name === 'mobile' ?
        { width: 393, height: 851 }
      : { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const name = `Stack ${testInfo.project.name}`;
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
    .getByRole('link', { name: /Add to a workspace Oak Permissions/ })
    .click();
  await page.getByRole('link', { name: new RegExp(name) }).click();
  await page
    .getByRole('combobox', { name: 'Installed version', exact: true })
    .selectOption({ label: 'Oak 1.0 · modrinth · declared support' });
  await page.getByRole('button', { name: 'Add to stack', exact: true }).click();
  await expect(page).toHaveURL(`${base}/stack`);
  await expect(
    page.getByRole('main').getByText(/1 plugin recorded/),
  ).toBeVisible();
  await expect(
    page.getByRole('main').getByText('Oak 1.0 → Oak 1.0', { exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Edit entry', exact: true }).click();
  await expect(page).toHaveURL(/\/stack\/[0-9a-f-]{36}$/);
  const entryUrl = page.url();
  await page
    .getByRole('textbox', { name: 'Alias or purpose', exact: true })
    .fill('Permissions for survival');
  await page
    .getByRole('textbox', { name: 'Private notes', exact: true })
    .fill('Private stack browser note');
  await page
    .getByRole('checkbox', { name: 'Enabled in this stack', exact: true })
    .uncheck();
  await page.getByRole('button', { name: 'Save private metadata' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Private metadata saved.' }),
  ).toBeVisible();
  await page
    .getByRole('combobox', { name: 'Installed version', exact: true })
    .selectOption('manual');
  await page
    .getByRole('textbox', { name: 'Manual version', exact: true })
    .fill('local-build-7');
  await page.getByRole('button', { name: 'Save installed version' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Installed version saved.' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'Private notes', exact: true }),
  ).toHaveValue('Private stack browser note');
  await expect(
    page.getByRole('textbox', { name: 'Manual version', exact: true }),
  ).toHaveValue('local-build-7');
  await expect(
    page.getByRole('checkbox', { name: 'Enabled in this stack', exact: true }),
  ).not.toBeChecked();
  await page
    .getByRole('combobox', { name: 'Installed version', exact: true })
    .selectOption('unknown');
  await page.getByRole('button', { name: 'Save installed version' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Installed version saved.' }),
  ).toBeVisible();
  await page.goto(`${base}/stack`);
  await page
    .getByRole('combobox', { name: 'State', exact: true })
    .selectOption('disabled');
  await page.getByRole('button', { name: 'Filter stack' }).click();
  await expect(
    page.getByRole('heading', { name: 'Oak Permissions', exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('stack.png'),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const outside = await browser.newContext({
    storageState: 'tests/.auth/outsider.json',
    baseURL: 'http://127.0.0.1:3100',
  });
  const stranger = await outside.newPage();
  await stranger.goto(entryUrl);
  await expect(
    stranger.getByRole('heading', { name: 'Workspace unavailable' }),
  ).toBeVisible();
  await outside.close();
  await page.goto('/discover/plugins');
  await page.getByRole('link', { name: /^Oak Permissions/ }).click();
  await expect(page.getByText('Private stack browser note')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Add to a workspace', exact: true }),
  ).toBeVisible();
  await page.goto(`${base}/stack/import`);
  await page
    .getByRole('textbox', { name: 'Plugin list or JSON manifest', exact: true })
    .fill('Oak Permissions\nExternal Craft\nUnknown Fixture');
  await page.getByRole('button', { name: 'Preview import' }).click();
  await expect(
    page.getByRole('heading', { name: 'Confirm matches' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Import confirmed entries' }).click();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: '1 added · 1 skipped · 1 unresolved' }),
  ).toBeVisible();
  await page.goto(`${base}/stack`);
  await expect(
    page.getByRole('main').getByText(/2 plugins recorded/),
  ).toBeVisible();
  await page.goto(base);
  await expect(
    page.getByRole('link', { name: /Plugins 2 Recorded plugins/ }),
  ).toBeVisible();
  await page.goto(`${base}/stack`);
  for (const plugin of ['Oak Permissions', 'External Craft']) {
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
  await expect(
    page.getByRole('heading', { name: 'Record your first plugin' }),
  ).toBeVisible();
  await page.goto(`${base}/settings`);
  await page
    .getByRole('button', { name: 'Archive workspace', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: `Type “${name}” to confirm`, exact: true })
    .fill(name);
  await page
    .getByRole('button', { name: 'Permanently delete workspace', exact: true })
    .click();
  await expect(page).toHaveURL(/\/servers\?archived=true$/);
  await context.close();
});
