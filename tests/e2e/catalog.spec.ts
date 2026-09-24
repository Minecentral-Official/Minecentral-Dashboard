import { expect, test } from '@playwright/test';

test('public catalog filters, attributed releases, stable URLs and external-only states', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    viewport:
      testInfo.project.name === 'mobile' ?
        { width: 393, height: 851 }
      : { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/discover/plugins');
  await expect(
    page.getByRole('heading', { name: 'Plugin catalog', exact: true }),
  ).toBeVisible();
  await page.getByLabel('Name or description').fill('Oak');
  await page
    .getByRole('combobox', { name: 'Platform', exact: true })
    .selectOption('paper');
  await page.getByLabel('Minecraft version').fill('1.21.11');
  await page
    .getByRole('combobox', { name: 'Source', exact: true })
    .selectOption('modrinth');
  await page.getByRole('button', { name: 'Search catalog' }).click();
  await expect(page).toHaveURL(/platform=paper/);
  await expect(
    page.getByRole('heading', { name: 'Oak Permissions' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'External Craft' }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel('Minecraft version')).toHaveValue('1.21.11');
  await page.getByRole('link', { name: /Oak Permissions/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Oak Permissions', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'View on modrinth' }),
  ).toHaveAttribute('href', 'https://modrinth.com/plugin/oak-permissions');
  await expect(
    page.getByText('Last successful sync:', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oak 1.0' })).toBeVisible();
  await page.getByText('Declared dependencies (1)').click();
  await expect(
    page.getByText('Optional bridge · optional · paper'),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('catalog-detail.png'),
    fullPage: true,
    caret: 'initial',
  });
  const stable = page.url();
  await page.goto(stable.replace(/\/[^/]+$/, '/old-slug'));
  await expect(page).toHaveURL(stable);
  await page.goto('/discover/plugins?source=manual');
  await page.getByRole('link', { name: /External Craft/ }).click();
  await expect(
    page.getByText('Manually curated · external links only.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText('No synced versions available.', { exact: false }),
  ).toBeVisible();
  await page.goto('/discover/plugins?q=not-a-real-plugin');
  await expect(
    page.getByRole('heading', { name: 'No matching plugins' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Clear filters' }).click();
  await expect(
    page.getByRole('heading', { name: 'Oak Permissions' }),
  ).toBeVisible();
  await context.close();
});

test('curator queues imports without fetching during the request', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:3100',
    storageState: 'tests/.auth/curator.json',
    viewport:
      testInfo.project.name === 'mobile' ?
        { width: 393, height: 851 }
      : { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/admin/catalog');
  await expect(
    page.getByRole('heading', { name: 'Catalog curation', exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('Project ID or slug')
    .fill(`browser-fixture-${testInfo.project.name}`);
  await page.getByRole('button', { name: 'Queue metadata sync' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Sync queued.' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Sync jobs and source freshness' })
    .click();
  await expect(
    page.getByText(`modrinth / browser-fixture-${testInfo.project.name}`, {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText(/queued · attempt 0/).first()).toBeVisible();
  await context.close();
});
