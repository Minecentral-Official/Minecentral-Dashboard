import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  addMemberAction,
  archiveWorkspaceAction,
  deleteWorkspaceAction,
  removeMemberAction,
  updateWorkspaceAction,
} from '@/features/workspaces/actions/workspace.actions';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import WorkspaceForm from '@/features/workspaces/components/workspace-form';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';
import {
  loadWorkspace,
  workspaceActor,
  workspaceService,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export default async function WorkspaceSettings({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = await loadWorkspace((await params).workspaceId);
  const owner = workspace.role === 'owner';
  const canEdit =
    canUseWorkspace(workspace.role, 'settings') && !workspace.archivedAt;
  const members =
    owner ?
      await workspaceService.members(await workspaceActor(), workspace.id)
    : [];
  return (
    <div className='max-w-3xl space-y-8'>
      <div>
        <h2 className='text-xl font-semibold'>Workspace settings</h2>
        <p className='mt-2 text-muted-foreground'>
          Your role: <span className='capitalize'>{workspace.role}</span>.
          Changes apply only to {workspace.name}.
        </p>
      </div>
      <section className='rounded-lg border bg-card p-5 sm:p-7'>
        {canEdit ?
          <WorkspaceForm
            key={`${workspace.id}:${workspace.visibility}`}
            action={updateWorkspaceAction.bind(null, workspace.id)}
            workspace={workspace}
            owner={owner}
          />
        : <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              {workspace.archivedAt ?
                'Restore this workspace to edit settings.'
              : 'Only the owner and workspace admins can edit these settings.'}
            </p>
            <dl className='grid gap-4 sm:grid-cols-2'>
              <div>
                <dt className='text-sm text-muted-foreground'>Description</dt>
                <dd className='whitespace-pre-wrap break-words'>
                  {workspace.description || 'Not recorded'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>Status</dt>
                <dd className='capitalize'>{workspace.status}</dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>Access</dt>
                <dd>
                  {workspace.visibility === 'private' ?
                    'Owner only'
                  : 'Owner and collaborators'}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>
                  Server address
                </dt>
                <dd className='break-all'>
                  {workspace.connectionHost ?
                    `${workspace.connectionHost}${workspace.connectionPort ? `:${workspace.connectionPort}` : ''}`
                  : 'Not recorded'}
                </dd>
              </div>
            </dl>
            <div>
              <h3 className='text-sm text-muted-foreground'>Private notes</h3>
              <p className='whitespace-pre-wrap break-words'>
                {workspace.notes || 'No notes yet.'}
              </p>
            </div>
          </div>
        }
      </section>
      {owner && (
        <>
          <section className='space-y-5 rounded-lg border p-5 sm:p-7'>
            <div>
              <h2 className='text-lg font-semibold'>Collaborators</h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                Add a teammate using the email on their existing MineCentral
                account. Adding them enables team sharing. No invitation email
                is sent.
              </p>
              <p className='mt-2 text-sm text-muted-foreground'>
                Admins edit settings; editors will manage stack/config content
                when available; viewers have read-only access. Only you manage
                sharing and deletion.
              </p>
              {workspace.visibility === 'private' && members.length > 0 && (
                <p className='mt-2 text-sm text-amber-500'>
                  Access is currently owner-only. Existing collaborators regain
                  access when you enable team sharing.
                </p>
              )}
            </div>
            {!workspace.archivedAt && (
              <WorkspaceActionForm
                action={addMemberAction.bind(null, workspace.id)}
                label='Save collaborator access'
              >
                <div className='grid gap-3 sm:grid-cols-[1fr_10rem]'>
                  <div className='space-y-2'>
                    <Label htmlFor='collaborator-email'>Account email</Label>
                    <Input
                      id='collaborator-email'
                      name='email'
                      type='email'
                      required
                      maxLength={254}
                      autoComplete='off'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='collaborator-role'>Role</Label>
                    <select
                      id='collaborator-role'
                      name='role'
                      className={workspaceSelectClass}
                      defaultValue='viewer'
                    >
                      <option value='viewer'>Viewer</option>
                      <option value='editor'>Editor</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </div>
                </div>
              </WorkspaceActionForm>
            )}
            {members.length ?
              <ul className='divide-y'>
                {members.map((member) => (
                  <li
                    key={member.userId}
                    className='flex flex-wrap items-center justify-between gap-3 py-4'
                  >
                    <div className='min-w-0'>
                      <p className='break-words font-medium'>
                        {member.name}{' '}
                        <span className='text-xs capitalize text-muted-foreground'>
                          · {member.role}
                        </span>
                      </p>
                      <p className='break-all text-sm text-muted-foreground'>
                        {member.email}
                      </p>
                    </div>
                    <WorkspaceActionForm
                      action={removeMemberAction.bind(
                        null,
                        workspace.id,
                        member.userId,
                      )}
                      label={`Remove ${member.name}`}
                    />
                  </li>
                ))}
              </ul>
            : <p className='text-sm text-muted-foreground'>
                No collaborators assigned.
              </p>
            }
          </section>
          <section className='space-y-4 rounded-lg border p-5 sm:p-7'>
            <h2 className='text-lg font-semibold'>
              {workspace.archivedAt ? 'Restore workspace' : 'Archive workspace'}
            </h2>
            <p className='text-sm text-muted-foreground'>
              Archiving keeps settings, collaborators and activity. You can
              restore the workspace later.
            </p>
            <WorkspaceActionForm
              action={archiveWorkspaceAction.bind(
                null,
                workspace.id,
                !workspace.archivedAt,
              )}
              label={
                workspace.archivedAt ? 'Restore workspace' : 'Archive workspace'
              }
            />
          </section>
          {workspace.archivedAt && (
            <section className='space-y-4 rounded-lg border border-destructive p-5 sm:p-7'>
              <h2 className='text-lg font-semibold'>
                Permanently delete workspace
              </h2>
              <p className='text-sm text-muted-foreground'>
                This removes this workspace’s metadata, notes, collaborator
                assignments and activity permanently. It does not delete your
                account, public server listings or the Minecraft server itself.
              </p>
              <WorkspaceActionForm
                action={deleteWorkspaceAction.bind(null, workspace.id)}
                label='Permanently delete workspace'
                destructive
              >
                <Label htmlFor='delete-workspace-name'>
                  Type “{workspace.name}” to confirm
                </Label>
                <Input
                  id='delete-workspace-name'
                  name='confirmation'
                  required
                  autoComplete='off'
                />
              </WorkspaceActionForm>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
