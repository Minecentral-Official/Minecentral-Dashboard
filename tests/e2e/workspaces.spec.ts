import { expect, test } from '@playwright/test';

test('create, navigate, edit, share, archive, restore and delete a private workspace', async ({
  page,
  browser,
}, testInfo) => {
  const name = `Oakwood ${testInfo.project.name}`;
  await page.goto('/servers');
  await expect(
    page.getByRole('heading', { name: 'My Servers', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Start with your first server' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Create workspace', exact: true })
    .first()
    .click();
  await page.getByLabel('Server name', { exact: true }).fill(name);
  await page.getByLabel('Java version', { exact: true }).selectOption('21');
  await page
    .getByRole('button', { name: 'Create workspace', exact: true })
    .click();
  await expect(page).toHaveURL(/\/servers\/[0-9a-f-]{36}$/);
  const workspaceUrl = page.url();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Server overview' }),
  ).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Workspace sections' });
  for (const section of [
    'Stack',
    'Configs',
    'Compatibility',
    'Updates',
    'Diagnostics',
  ]) {
    await nav.getByRole('link', { name: section, exact: true }).click();
    await expect(
      page.getByRole('heading', { name: section, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name, exact: true }),
    ).toBeVisible();
  }
  await nav.getByRole('link', { name: 'Settings', exact: true }).click();
  await page
    .getByLabel('Private notes')
    .fill('Keep this only inside the workspace.');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByLabel('Private notes')).toHaveValue(
    'Keep this only inside the workspace.',
  );
  await expect(
    page.getByRole('status').filter({ hasText: 'Settings saved.' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Private notes')).toHaveValue(
    'Keep this only inside the workspace.',
  );
  await page.screenshot({
    path: testInfo.outputPath('workspace-settings.png'),
    fullPage: true,
    caret: 'initial',
  });

  const other = await browser.newContext({
    storageState: 'tests/.auth/outsider.json',
    baseURL: 'http://127.0.0.1:3100',
  });
  const teammate = await other.newPage();
  await teammate.goto(workspaceUrl);
  await expect(
    teammate.getByRole('heading', { name: 'Workspace unavailable' }),
  ).toBeVisible();
  await page.getByLabel('Account email').fill('outsider@example.test');
  await page.getByRole('button', { name: 'Save collaborator access' }).click();
  await expect(
    page.getByRole('button', { name: 'Remove Test outsider' }),
  ).toBeVisible();
  await teammate.goto(`${workspaceUrl}/settings`);
  await expect(
    teammate.getByText(
      'Only the owner and workspace admins can edit these settings.',
    ),
  ).toBeVisible();
  await expect(
    teammate.getByRole('button', { name: 'Save changes' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove Test outsider' }).click();
  await expect(
    page.getByRole('button', { name: 'Remove Test outsider' }),
  ).toHaveCount(0);
  await teammate.reload();
  await expect(
    teammate.getByRole('heading', { name: 'Workspace unavailable' }),
  ).toBeVisible();
  await other.close();

  await page
    .getByRole('button', { name: 'Archive workspace', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Restore workspace', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Restore workspace', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Save changes', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Archive workspace', exact: true })
    .click();
  await page.getByLabel(`Type “${name}” to confirm`).fill('wrong name');
  await page
    .getByRole('button', { name: 'Permanently delete workspace', exact: true })
    .click();
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Type the exact workspace name' }),
  ).toContainText('Type the exact workspace name');
  await page.getByLabel(`Type “${name}” to confirm`).fill(name);
  await page
    .getByRole('button', { name: 'Permanently delete workspace', exact: true })
    .click();
  await expect(page).toHaveURL(/\/servers\?archived=true$/);
  await expect(
    page.getByRole('heading', { name: 'No archived workspaces' }),
  ).toBeVisible();
});
