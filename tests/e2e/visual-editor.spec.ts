import { expect, test } from '@playwright/test';

import { templateDocument } from '../../src/features/workspaces/services/visual-document';
import { visualSchemaFixture } from '../fixtures/visual-schema';

test('visual YAML and split modes preserve unknowns, nested edits and drafts, preview defaults and fall back for unsupported releases', async ({
  browser,
}, testInfo) => {
  test.setTimeout(240000);
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: `tests/.auth/visual-${testInfo.project.name}.json`,
    viewport:
      testInfo.project.name === 'mobile' ?
        { width: 393, height: 851 }
      : { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on('dialog', (dialog) => dialog.accept());
  const name = `Visual ${testInfo.project.name}`;
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
    .selectOption('manual');
  await page
    .getByRole('textbox', { name: 'Manual version', exact: true })
    .fill('1.0');
  await page.getByRole('button', { name: 'Add to stack', exact: true }).click();
  await expect(page).toHaveURL(`${base}/stack`);
  await page
    .getByRole('heading', { name: 'Oak Permissions', exact: true })
    .getByRole('link')
    .click();
  await expect(page).toHaveURL(/\/stack\/[0-9a-f-]{36}$/);
  const entryUrl = page.url();
  await page
    .getByRole('link', { name: 'Import plugin config', exact: true })
    .click();
  const original =
    '# Preserve my comment\n' +
    templateDocument(visualSchemaFixture) +
    'unknown-setting: "keep me"\n';
  await page
    .getByRole('textbox', { name: 'File path', exact: true })
    .fill('plugins/Oak/config.yml');
  await page
    .getByRole('textbox', { name: 'YAML content', exact: true })
    .fill(original);
  await page
    .getByRole('button', { name: 'Import config', exact: true })
    .click();
  await expect(page).toHaveURL(/\/configs\/[0-9a-f-]{36}$/);
  const configUrl = page.url();
  await page.getByRole('button', { name: 'Visual', exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: 'Plugin enabled *', exact: true }),
  ).toHaveValue('true');
  await page
    .getByRole('combobox', { name: 'Permission mode', exact: true })
    .selectOption('advanced');
  await expect(
    page.getByRole('combobox', { name: 'Debug logging', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('spinbutton', { name: 'Timeout (seconds)', exact: true })
    .fill('80');
  await page
    .getByRole('spinbutton', { name: 'Timeout (seconds)', exact: true })
    .press('Tab');
  await expect(
    page.getByText(/Recommendation: Recommended range/),
  ).toBeVisible();
  await page
    .getByRole('button', {
      name: 'Move Backend servers item 1 down',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('textbox', { name: 'Server name *', exact: true }).first(),
  ).toHaveValue('survival');
  await page
    .getByRole('textbox', {
      name: 'Key default in Permission groups',
      exact: true,
    })
    .fill('member');
  await page
    .getByRole('textbox', {
      name: 'Key default in Permission groups',
      exact: true,
    })
    .press('Tab');
  await expect(
    page.getByRole('textbox', {
      name: 'Key member in Permission groups',
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'New key in Permission groups', exact: true })
    .fill('member');
  await page
    .getByRole('button', { name: 'Add key to Permission groups', exact: true })
    .click();
  await expect(
    page
      .getByRole('main')
      .getByRole('alert')
      .filter({ hasText: 'unique map key' }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'New key in Permission groups', exact: true })
    .fill('staff');
  await page
    .getByRole('button', { name: 'Add key to Permission groups', exact: true })
    .click();
  await page
    .getByRole('searchbox', { name: 'Find a setting', exact: true })
    .fill('timeout');
  await page
    .getByRole('searchbox', { name: 'Find a setting', exact: true })
    .press('Enter');
  await expect(
    page.getByRole('spinbutton', { name: 'Timeout (seconds)', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('combobox', { name: 'Plugin enabled *', exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole('searchbox', { name: 'Find a setting', exact: true })
    .fill('');
  await page.getByRole('button', { name: 'Split', exact: true }).click();
  const raw = page.getByRole('textbox', { name: 'YAML content', exact: true });
  if (testInfo.project.name === 'desktop') {
    const divider = page.getByRole('separator', {
      name: 'Resize editor panels',
    });
    await divider.focus();
    await divider.press('ArrowRight');
  }
  const changed = await raw.inputValue();
  expect(changed).toContain('# Preserve my comment');
  expect(changed).toContain('unknown-setting: "keep me"');
  expect(changed).toContain('timeout: 80');
  await raw.fill('broken: [');
  await expect(
    page.getByText(
      'YAML is invalid. The last valid visual values are shown read-only. Fix the YAML to continue.',
    ),
  ).toBeVisible();
  await expect(
    page.getByRole('spinbutton', { name: 'Timeout (seconds)', exact: true }),
  ).toBeDisabled();
  await raw.fill(changed);
  await expect(
    page.getByRole('spinbutton', { name: 'Timeout (seconds)', exact: true }),
  ).toBeEnabled();
  await page.screenshot({
    path: testInfo.outputPath('visual-split.png'),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Configuration saved.' }),
  ).toBeVisible();
  await page
    .getByText('Defaults and schema details', { exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole('button', { name: 'Preview default template', exact: true })
    .click();
  await expect(
    page.getByRole('region', { name: 'Default template preview' }),
  ).toContainText('unknown-setting');
  await page
    .getByRole('button', { name: 'Cancel replacement', exact: true })
    .click();
  expect(await raw.inputValue()).toContain('unknown-setting');
  await page
    .getByRole('button', { name: 'Reset Connection settings', exact: true })
    .click();
  expect(await raw.inputValue()).toContain('timeout: 30');
  expect(await raw.inputValue()).toContain('unknown-setting');
  await page
    .getByRole('button', { name: 'Preview default template', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Replace draft with defaults', exact: true })
    .click();
  expect(await raw.inputValue()).not.toContain('unknown-setting');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Configuration saved.' }),
  ).toBeVisible();
  await page.goto(entryUrl);
  await page
    .getByRole('textbox', { name: 'Manual version', exact: true })
    .fill('2.0');
  await page
    .getByRole('button', { name: 'Save installed version', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Installed version saved.' }),
  ).toBeVisible();
  await page.goto(configUrl);
  await expect(
    page.getByRole('button', { name: 'Visual', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/No reviewed visual schema covers/),
  ).toBeVisible();
  const curator = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: 'tests/.auth/curator.json',
  });
  const admin = await curator.newPage();
  await admin.goto('/admin/config-schemas');
  const published = {
    ...visualSchemaFixture,
    key: `browser-${testInfo.project.name}`,
    title: `Browser ${testInfo.project.name}`,
    filename: `browser-${testInfo.project.name}.yml`,
    target: {
      ...visualSchemaFixture.target,
      kind: 'server',
      versionRange: '=1.21.11',
    },
    provenance: {
      ...visualSchemaFixture.provenance,
      verifiedVersion: '1.21.11',
    },
  };
  await admin
    .getByRole('textbox', { name: 'Schema JSON', exact: true })
    .fill(JSON.stringify(published));
  await admin
    .getByRole('button', { name: 'Publish schema release', exact: true })
    .click();
  await expect(
    admin.getByRole('status').filter({ hasText: 'Schema release published.' }),
  ).toBeVisible();
  const article = admin.getByRole('article').filter({
    has: admin.getByRole('heading', {
      name: `Browser ${testInfo.project.name} · release 1`,
      exact: true,
    }),
  });
  await article.getByRole('checkbox').check();
  await article
    .getByRole('button', { name: 'Retire release', exact: true })
    .click();
  await expect(
    admin.getByRole('heading', {
      name: `Browser ${testInfo.project.name} · release 1 · retired`,
      exact: true,
    }),
  ).toBeVisible();
  await curator.close();
  await context.close();
});
