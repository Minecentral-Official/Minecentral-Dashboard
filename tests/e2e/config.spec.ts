import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('import YAML, preserve invalid drafts, save, download, restore and retain orphaned plugin configs', async ({
  browser,
}, testInfo) => {
  test.setTimeout(180000);
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: `tests/.auth/config-${testInfo.project.name}.json`,
    viewport:
      testInfo.project.name === 'mobile' ?
        { width: 393, height: 851 }
      : { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const name = `Config ${testInfo.project.name}`;
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
  await page.getByRole('button', { name: 'Add to stack', exact: true }).click();
  await expect(page).toHaveURL(`${base}/stack`);
  await page
    .getByRole('heading', { name: 'Oak Permissions', exact: true })
    .getByRole('link')
    .click();
  const entryUrl = page.url();
  await page
    .getByRole('link', { name: 'Import plugin config', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'File path', exact: true })
    .fill('plugins/Oak/config.yml');
  await page
    .getByRole('textbox', { name: 'YAML content', exact: true })
    .fill('settings: [');
  await page
    .getByRole('button', { name: 'Import config', exact: true })
    .click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    'Fix the YAML errors',
  );
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toHaveValue('settings: [');
  await expect(
    page.getByRole('textbox', { name: 'File path', exact: true }),
  ).toHaveValue('plugins/Oak/config.yml');
  await expect(
    page.getByRole('combobox', { name: 'Belongs to', exact: true }),
  ).toHaveValue('plugin');
  const original =
    '# Keep this comment\r\nsettings:\r\n  allow-end: true\r\nunknown-key: "001"\r\n';
  await page
    .getByLabel('Upload YAML (optional)', { exact: true })
    .setInputFiles({
      name: 'config.yml',
      mimeType: 'application/yaml',
      buffer: Buffer.from(original),
    });
  await page
    .getByRole('combobox', { name: 'Validation', exact: true })
    .selectOption('bukkit-basic');
  await page
    .getByRole('button', { name: 'Import config', exact: true })
    .click();
  await expect(page).toHaveURL(/\/configs\/[0-9a-f-]{36}$/);
  const configUrl = page.url();
  const workspaceId = base.split('/').at(-1)!;
  const configId = configUrl.split('/').at(-1)!;
  const downloadUrl = `/api/workspaces/${workspaceId}/configs/${configId}/download`;
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toHaveValue(original.replace(/\r\n/g, '\n'));
  await page
    .getByRole('textbox', { name: 'YAML content', exact: true })
    .fill('broken: [');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    'Fix the YAML errors',
  );
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toHaveValue('broken: [');
  expect(await (await context.request.get(downloadUrl)).text()).toBe(original);
  const updated = original
    .replace(/\r\n/g, '\n')
    .replace('allow-end: true', 'allow-end: wrong');
  await page
    .getByRole('textbox', { name: 'YAML content', exact: true })
    .fill(updated);
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Configuration saved.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Schema warning/ }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download YAML', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('config.yml');
  expect(await readFile((await download.path())!, 'utf8')).toBe(updated);
  await page.screenshot({
    path: testInfo.outputPath('config-editor.png'),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const outside = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: 'tests/.auth/outsider.json',
  });
  const denied = await outside.request.get(downloadUrl);
  expect(denied.status()).toBe(404);
  expect(await denied.text()).not.toContain('unknown-key');
  await outside.close();
  await page.getByRole('link', { name: 'History', exact: true }).click();
  await expect(page.getByLabel('Revision diff')).toContainText('allow-end');
  await page
    .getByText('Restore revision 1', { exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole('link', { name: 'Cancel and return to editor', exact: true })
    .click();
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toHaveValue(updated);
  await page.getByRole('link', { name: 'History', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Revision history', exact: true }),
  ).toBeVisible();
  const restore = page
    .getByText('Restore revision 1', { exact: true })
    .filter({ visible: true });
  if (
    !(await page
      .getByRole('checkbox', { name: /I confirm restoring/ })
      .isVisible())
  )
    await restore.click();
  await page.getByRole('checkbox', { name: /I confirm restoring/ }).check();
  await page
    .getByRole('button', { name: 'Restore revision', exact: true })
    .click();
  await expect(page).toHaveURL(/\?restored=3$/);
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toHaveValue(original.replace(/\r\n/g, '\n'));
  await page.goto(entryUrl);
  await expect(
    page.getByRole('link', { name: 'plugins/Oak/config.yml', exact: true }),
  ).toBeVisible();
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
  await page
    .getByRole('button', { name: 'Remove from stack', exact: true })
    .click();
  await expect(page).toHaveURL(`${base}/stack`);
  await page.goto(configUrl);
  await expect(
    page.getByRole('status').filter({ hasText: 'Orphaned config' }),
  ).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'YAML content', exact: true }),
  ).toHaveValue(original.replace(/\r\n/g, '\n'));
  await page
    .getByText('File settings', { exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Belongs to', exact: true })
    .selectOption('unlinked');
  await page
    .getByRole('button', { name: 'Save file settings', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'File settings saved.' }),
  ).toBeVisible();
  await page
    .getByText('Delete config and history', { exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole('textbox', {
      name: 'Type the file path to confirm',
      exact: true,
    })
    .fill('plugins/Oak/config.yml');
  await page
    .getByRole('button', { name: 'Delete config', exact: true })
    .click();
  await expect(page).toHaveURL(`${base}/configs`);
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
