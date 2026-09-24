import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { curateCompatibilityAction } from '@/features/workspaces/actions/compatibility.actions';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';
import { compatibilityService } from '@/features/workspaces/queries/compatibility-access';
import requirePermission from '@/lib/auth/helpers/require-permission';

export const instant = false;
async function ProvenanceFields() {
  const today = new Date().toISOString().slice(0, 10);
  // Server-only request-time defaults; this component has no client render lifecycle.
  // eslint-disable-next-line react-hooks/purity
  const expires = new Date(Date.now() + 90 * 86400000)
    .toISOString()
    .slice(0, 10);
  return (
    <>
      <label className='block space-y-2 text-sm'>
        Evidence description
        <Textarea
          name='provenance'
          required
          minLength={10}
          maxLength={2000}
          placeholder='Describe the observation, method and why the scope is appropriate.'
        />
      </label>
      <label className='block space-y-2 text-sm'>
        Evidence URL
        <Input
          name='url'
          type='url'
          required
          placeholder='https://publisher.example/evidence'
        />
      </label>
      <div className='grid gap-3 sm:grid-cols-2'>
        <label className='space-y-2 text-sm'>
          Observed on
          <Input
            name='observedAt'
            type='date'
            required
            defaultValue={today}
            max={today}
          />
        </label>
        <label className='space-y-2 text-sm'>
          Expires on
          <Input name='expiresAt' type='date' required defaultValue={expires} />
        </label>
      </div>
    </>
  );
}
export default async function CompatibilityAdmin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { user } = await requirePermission('catalog:curate');
  const requestedPage = Number((await searchParams).page);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ?
      Math.min(10000, requestedPage)
    : 1;
  const data = await compatibilityService.operations(user.id, page);
  return (
    <main className='mx-auto max-w-4xl space-y-8 p-4'>
      <Link href='/admin/catalog' className='text-sm underline'>
        ← Catalog curation
      </Link>
      <h1 className='text-3xl font-semibold'>Compatibility curation</h1>
      <p className='text-muted-foreground'>
        Record attributable evidence, maintain scoped relationships, and review
        opted-in community observations. No source silently overrides
        conflicting evidence.
      </p>
      <p
        role={data.failures ? 'alert' : undefined}
        className='rounded-lg border p-4 text-sm'
      >
        {data.failures} workspace reports have a recorded recompute failure.
        Workspace owners can retry from Compatibility; private report contents
        are not exposed here.
      </p>
      <p className='text-sm text-muted-foreground'>
        Use canonical project IDs from catalog URLs. Release IDs are shown on
        catalog version details. Numeric constraints support exact dotted
        versions or comparisons such as ≥ (written as &gt;=) 1.0; enter
        “&gt;=1.0 &lt;2.0” with no space after the operator. Other syntax
        remains unknown.
      </p>
      <section className='rounded-lg border p-5'>
        <h2 className='mb-4 text-xl font-semibold'>Record runtime evidence</h2>
        <WorkspaceActionForm
          action={curateCompatibilityAction}
          label='Save runtime evidence'
        >
          <input type='hidden' name='operation' value='evidence' />
          <label className='block space-y-2 text-sm'>
            Catalog release ID
            <Input name='versionId' required />
          </label>
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='space-y-2 text-sm'>
              Platform
              <Input name='platform' required defaultValue='paper' />
            </label>
            <label className='space-y-2 text-sm'>
              Minecraft version
              <Input name='minecraftVersion' required defaultValue='1.21.11' />
            </label>
          </div>
          <div className='grid gap-3 sm:grid-cols-3'>
            <label className='space-y-2 text-sm'>
              Evidence kind
              <select name='kind' className={workspaceSelectClass}>
                <option value='manual-curation'>Manual curation</option>
                <option value='developer-declared'>
                  Developer declaration
                </option>
                <option value='automated-test'>Automated test</option>
              </select>
            </label>
            <label className='space-y-2 text-sm'>
              Result
              <select name='result' className={workspaceSelectClass}>
                <option value='compatible'>Compatible</option>
                <option value='incompatible'>Incompatible</option>
                <option value='unknown'>Unknown</option>
              </select>
            </label>
            <label className='space-y-2 text-sm'>
              Confidence
              <select
                name='confidence'
                className={workspaceSelectClass}
                defaultValue='medium'
              >
                <option value='high'>High</option>
                <option value='medium'>Medium</option>
                <option value='low'>Low (context only)</option>
              </select>
            </label>
          </div>
          <ProvenanceFields />
        </WorkspaceActionForm>
      </section>
      <section className='rounded-lg border p-5'>
        <h2 className='mb-4 text-xl font-semibold'>Record a relationship</h2>
        <WorkspaceActionForm
          action={curateCompatibilityAction}
          label='Save relationship'
        >
          <input type='hidden' name='operation' value='relationship' />
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='space-y-2 text-sm'>
              From project ID
              <Input name='fromProjectId' required />
            </label>
            <label className='space-y-2 text-sm'>
              To project ID
              <Input name='toProjectId' required />
            </label>
            <label className='space-y-2 text-sm'>
              From release ID (optional)
              <Input name='fromVersionId' />
            </label>
            <label className='space-y-2 text-sm'>
              To release ID (optional)
              <Input name='toVersionId' />
            </label>
          </div>
          <label className='block space-y-2 text-sm'>
            Relationship kind
            <select name='kind' className={workspaceSelectClass}>
              <option value='required'>Required dependency</option>
              <option value='optional'>Optional dependency</option>
              <option value='conflict'>Hard conflict</option>
              <option value='overlap'>Informational overlap</option>
            </select>
          </label>
          <label className='block space-y-2 text-sm'>
            Target version range (instead of exact release)
            <Input
              name='versionRange'
              maxLength={150}
              placeholder='>=1.0 <2.0'
            />
          </label>
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='space-y-2 text-sm'>
              Platform scope (blank for all)
              <Input name='platform' />
            </label>
            <label className='space-y-2 text-sm'>
              Minecraft scope (blank for all)
              <Input name='minecraftVersion' />
            </label>
          </div>
          <ProvenanceFields />
        </WorkspaceActionForm>
      </section>
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>Community review queue</h2>
        <p className='text-sm text-muted-foreground'>
          Approve only credible first-hand test descriptions for the exact
          release/runtime. No self-review. Three distinct approved, non-banned
          accounts aged seven days or more are needed for each aggregated
          result; reports expire after 90 days.
        </p>
        {!data.reports.length && <p>No pending reports on this page.</p>}
        <ul className='space-y-4'>
          {data.reports.map(({ report: r, versionName, projectName }) => (
            <li key={r.id} className='rounded-lg border p-5'>
              <h3 className='font-semibold'>
                {projectName} / {versionName}
              </h3>
              <p className='mt-2 text-sm'>
                {r.platform} / {r.minecraftVersion} · {r.result} · observed{' '}
                {r.observedAt.toISOString().slice(0, 10)}
              </p>
              <p className='my-4 whitespace-pre-wrap break-words text-sm text-muted-foreground'>
                {r.detail}
              </p>
              <WorkspaceActionForm
                action={curateCompatibilityAction}
                label='Save review'
              >
                <input type='hidden' name='operation' value='review' />
                <input type='hidden' name='id' value={r.id} />
                <label className='block space-y-2 text-sm'>
                  Review decision
                  <select
                    name='decision'
                    className={workspaceSelectClass}
                    defaultValue='rejected'
                  >
                    <option value='rejected'>Reject</option>
                    <option value='approved'>
                      Approve as trusted evidence
                    </option>
                  </select>
                </label>
                <label className='block space-y-2 text-sm'>
                  Review reason
                  <Input
                    name='reason'
                    required
                    minLength={10}
                    maxLength={2000}
                  />
                </label>
              </WorkspaceActionForm>
            </li>
          ))}
        </ul>
      </section>
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          Recorded evidence and relationships
        </h2>
        <ul className='space-y-3'>
          {[
            ...data.evidence.map((r) => ({ ...r, recordType: 'evidence' })),
            ...data.relationships.map((r) => ({
              ...r,
              recordType: 'relationship',
            })),
          ].map((r) => (
            <li key={r.id} className='rounded-lg border p-4'>
              <p className='text-sm'>
                {r.kind} · {r.provenance}
              </p>
              <p className='my-2 font-mono text-xs text-muted-foreground'>
                {r.id} · expires {r.expiresAt.toISOString().slice(0, 10)}
                {r.revokedAt ? ' · revoked' : ''}
              </p>
              {!r.revokedAt && (
                <WorkspaceActionForm
                  action={curateCompatibilityAction}
                  label='Revoke record'
                  destructive
                >
                  <input type='hidden' name='operation' value='revoke' />
                  <input type='hidden' name='recordType' value={r.recordType} />
                  <input type='hidden' name='id' value={r.id} />
                  <Input
                    name='reason'
                    aria-label='Revocation reason'
                    required
                    minLength={10}
                    maxLength={2000}
                    placeholder='Reason for revocation'
                  />
                </WorkspaceActionForm>
              )}
            </li>
          ))}
        </ul>
      </section>
      <nav aria-label='Curation pages' className='flex justify-between'>
        {page > 1 ?
          <Link href={`?page=${page - 1}`}>← Previous records</Link>
        : <span />}
        {data.hasNext && <Link href={`?page=${page + 1}`}>More records →</Link>}
      </nav>
    </main>
  );
}
