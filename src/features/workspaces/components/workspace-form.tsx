'use client';

import { useActionState, useId } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';
import { workspaceVersions } from '@/features/workspaces/schemas/workspace-input';

import type { WorkspaceFormAction } from '@/features/workspaces/schemas/workspace-form-state';
import type { Workspace } from '@/features/workspaces/schemas/workspace.table';

export default function WorkspaceForm({
  action,
  workspace,
  owner = true,
}: {
  action: WorkspaceFormAction;
  workspace?: Workspace;
  owner?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const prefix = useId();
  const id = (field: string) => `${prefix}-${field}`;
  const error = (field: string) =>
    state.fields?.[field] ?
      <p id={id(`${field}-error`)} className='text-sm text-destructive'>
        {state.fields[field]}
      </p>
    : null;
  const accessibility = (field: string) => ({
    id: id(field),
    'aria-invalid': Boolean(state.fields?.[field]),
    'aria-describedby':
      state.fields?.[field] ? id(`${field}-error`) : undefined,
  });
  return (
    <form action={formAction} className='space-y-6'>
      {state.error && (
        <p
          role='alert'
          className='rounded-md border border-destructive p-3 text-sm'
        >
          {state.error}
        </p>
      )}
      {state.message && (
        <p
          role='status'
          className='rounded-md border border-primary p-3 text-sm'
        >
          {state.message}
        </p>
      )}
      <fieldset disabled={pending} className='space-y-5'>
        <div className='space-y-2'>
          <Label htmlFor={id('name')}>Server name</Label>
          <Input
            {...accessibility('name')}
            name='name'
            required
            maxLength={80}
            defaultValue={workspace?.name}
            placeholder='Oakwood survival'
            autoComplete='off'
          />
          {error('name')}
        </div>
        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='space-y-2'>
            <Label htmlFor={id('platform')}>Platform</Label>
            <select
              {...accessibility('platform')}
              name='platform'
              className={workspaceSelectClass}
              defaultValue={workspace?.platform ?? 'paper'}
            >
              <option value='paper'>Paper</option>
            </select>
            {error('platform')}
          </div>
          <div className='space-y-2'>
            <Label htmlFor={id('minecraftVersion')}>Minecraft version</Label>
            <select
              {...accessibility('minecraftVersion')}
              name='minecraftVersion'
              className={workspaceSelectClass}
              defaultValue={workspace?.minecraftVersion ?? '1.21.11'}
            >
              {workspaceVersions.map((version) => (
                <option key={version}>{version}</option>
              ))}
            </select>
            {error('minecraftVersion')}
          </div>
          <div className='space-y-2'>
            <Label htmlFor={id('javaVersion')}>Java version</Label>
            <select
              {...accessibility('javaVersion')}
              name='javaVersion'
              className={workspaceSelectClass}
              defaultValue={workspace?.javaVersion ?? ''}
            >
              <option value=''>Not recorded</option>
              <option value='21'>Java 21</option>
            </select>
            {error('javaVersion')}
          </div>
        </div>
        <p className='text-sm text-muted-foreground'>
          This beta records Paper servers on the versions shown. Paper
          recommends Java 21 for these versions. Plugin compatibility has not
          been checked.
        </p>
        {workspace && (
          <>
            <div className='space-y-2'>
              <Label htmlFor={id('description')}>Description</Label>
              <Textarea
                {...accessibility('description')}
                name='description'
                maxLength={500}
                defaultValue={workspace.description}
              />
              {error('description')}
            </div>
            <div className='space-y-2'>
              <Label htmlFor={id('notes')}>Private notes</Label>
              <Textarea
                {...accessibility('notes')}
                name='notes'
                maxLength={10000}
                rows={5}
                defaultValue={workspace.notes}
              />
              {error('notes')}
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor={id('status')}>Planning status</Label>
                <select
                  {...accessibility('status')}
                  name='status'
                  className={workspaceSelectClass}
                  defaultValue={workspace.status}
                >
                  <option value='planning'>Planning</option>
                  <option value='active'>Active project</option>
                  <option value='paused'>Paused</option>
                </select>
                {error('status')}
                <p className='text-xs text-muted-foreground'>
                  Set by your team; not a live server status.
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor={id('visibility')}>Who can access</Label>
                {owner ?
                  <select
                    {...accessibility('visibility')}
                    name='visibility'
                    className={workspaceSelectClass}
                    defaultValue={workspace.visibility}
                  >
                    <option value='private'>Only me</option>
                    <option value='team'>Me and assigned collaborators</option>
                  </select>
                : <>
                    <input
                      type='hidden'
                      name='visibility'
                      value={workspace.visibility}
                    />
                    <p className='text-sm text-muted-foreground'>
                      Sharing is managed by the owner.
                    </p>
                  </>
                }
                {error('visibility')}
                <p className='text-xs text-muted-foreground'>
                  Workspaces are never publicly listed.
                </p>
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-[1fr_8rem]'>
              <div className='space-y-2'>
                <Label htmlFor={id('connectionHost')}>
                  Server address (optional)
                </Label>
                <Input
                  {...accessibility('connectionHost')}
                  name='connectionHost'
                  maxLength={253}
                  defaultValue={workspace.connectionHost ?? ''}
                  placeholder='play.example.net'
                />
                {error('connectionHost')}
              </div>
              <div className='space-y-2'>
                <Label htmlFor={id('connectionPort')}>Port</Label>
                <Input
                  {...accessibility('connectionPort')}
                  name='connectionPort'
                  type='number'
                  min={1}
                  max={65535}
                  defaultValue={workspace.connectionPort ?? ''}
                />
                {error('connectionPort')}
              </div>
            </div>
            <p className='text-sm text-muted-foreground'>
              The address is a private reference. MineCentral does not connect
              to it or store server passwords here.
            </p>
          </>
        )}
        <Button type='submit'>
          {pending ?
            'Saving…'
          : workspace ?
            'Save changes'
          : 'Create workspace'}
        </Button>
      </fieldset>
    </form>
  );
}
