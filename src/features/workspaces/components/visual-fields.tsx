'use client';

import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  fieldDefault,
  fieldIssues,
  validMapKey,
  visible,
} from '@/features/workspaces/services/visual-document';

import type {
  ConfigValue,
  FieldSchema,
} from '@/features/workspaces/schemas/visual-schema';
import type {
  FieldPath,
  VisualEdit,
} from '@/features/workspaces/services/visual-document';

const selectClass = 'w-full rounded-md border bg-background px-3 py-2 text-sm';
function newValue(field: FieldSchema): ConfigValue {
  return (
    fieldDefault(field) ??
    (field.type === 'list' ? []
    : field.type === 'map' ? {}
    : field.type === 'boolean' ? false
    : field.type === 'number' ? 0
    : field.type === 'enum' ? field.options![0]
    : '')
  );
}
function matches(field: FieldSchema, search: string, path: FieldPath): boolean {
  return (
    !search ||
    `${field.label} ${field.description ?? ''} ${path.join('.')}`
      .toLowerCase()
      .includes(search) ||
    !!field.fields?.some((f) => matches(f, search, [...path, f.key])) ||
    (!!field.items && matches(field.items, search, path))
  );
}
export default function VisualFields({
  field,
  value,
  root,
  path = [],
  search = '',
  edit,
  disabled = false,
}: {
  field: FieldSchema;
  value: ConfigValue | undefined;
  root: ConfigValue | undefined;
  path?: FieldPath;
  search?: string;
  edit: (operation: VisualEdit) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [keyDraft, setKeyDraft] = useState('');
  const [localError, setLocalError] = useState('');
  if (!visible(field, root) || !matches(field, search, path)) return null;
  const issues = fieldIssues(field, value, path, root).filter(
    (i) => JSON.stringify(i.path) === JSON.stringify(path),
  );
  const object =
    value !== null && typeof value === 'object' && !Array.isArray(value);
  const fields = field.type === 'object' && object;
  const list = field.type === 'list' && Array.isArray(value);
  const map = field.type === 'map' && object;
  const set = (next: ConfigValue) => {
    setLocalError('');
    edit({ type: 'set', path, value: next });
  };
  const remove = (target: FieldPath, label: string) => {
    if (
      window.confirm(
        `Remove ${label}? This changes your draft; save to keep it.`,
      )
    )
      edit({ type: 'remove', path: target });
  };
  const incompatible =
    value !== undefined &&
    issues.some((i) => i.message.startsWith('Expected '));
  const child = (
    node: FieldSchema,
    v: ConfigValue | undefined,
    p: FieldPath,
  ) => (
    <VisualFields
      key={JSON.stringify(p)}
      field={node}
      value={v}
      root={root}
      path={p}
      search={search}
      edit={edit}
      disabled={disabled}
    />
  );
  return (
    <section
      className={
        path.length ?
          'space-y-3 border-l-2 border-border py-2 pl-4'
        : 'space-y-5'
      }
      aria-label={field.label}
    >
      {path.length > 0 && (
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <label htmlFor={id} className='text-sm font-semibold'>
            {field.label}
            {field.required ? ' *' : ''}
            {field.unit ? ` (${field.unit})` : ''}
          </label>
          <div className='flex flex-wrap gap-3 text-xs'>
            {fieldDefault(field) !== undefined && (
              <button
                type='button'
                disabled={disabled}
                className='underline disabled:opacity-50'
                onClick={() => {
                  if (
                    window.confirm(
                      `Reset ${field.label} to schema defaults? Unknown object settings are retained; lists and maps may be replaced.`,
                    )
                  )
                    edit({ type: 'reset', path, field });
                }}
              >
                Reset {field.label}
              </button>
            )}
            {value !== undefined && !field.required && (
              <button
                type='button'
                disabled={disabled}
                className='underline disabled:opacity-50'
                onClick={() => remove(path, field.label)}
              >
                Remove setting
              </button>
            )}
          </div>
        </div>
      )}
      {path.length > 0 && (
        <p className='break-all font-mono text-xs text-muted-foreground'>
          {path.join('.')}
        </p>
      )}
      {field.description && (
        <p id={`${id}-help`} className='text-sm text-muted-foreground'>
          {field.description}
        </p>
      )}
      {field.unit && field.type === 'number' && (
        <p className='text-xs text-muted-foreground'>
          Values are in {field.unit}.
        </p>
      )}
      {field.caution && (
        <p className='text-sm text-amber-700 dark:text-amber-400'>
          {field.caution}
        </p>
      )}
      {(field.examples?.length || field.link) && (
        <details className='text-xs'>
          <summary className='cursor-pointer'>Examples and reference</summary>
          {field.examples?.map((e, i) => (
            <p key={i} className='mt-2 whitespace-pre-wrap font-mono'>
              {e}
            </p>
          ))}
          {field.link && (
            <a
              className='mt-2 inline-block underline'
              href={field.link}
              target='_blank'
              rel='noreferrer'
            >
              Setting documentation
            </a>
          )}
        </details>
      )}
      {value === undefined ?
        <Button
          type='button'
          variant='outline'
          disabled={disabled}
          onClick={() => set(newValue(field))}
        >
          Add {field.label}
        </Button>
      : incompatible ?
        <p className='text-sm'>
          This value has a different type. Repair it in YAML or use Reset.
        </p>
      : fields ?
        <div className='space-y-4'>
          {field.fields?.map((f) =>
            child(
              f,
              Object.hasOwn(value, f.key) ?
                (value as Record<string, ConfigValue>)[f.key]
              : undefined,
              [...path, f.key],
            ),
          )}
        </div>
      : list ?
        <div className='space-y-4'>
          {(value as ConfigValue[]).slice(0, 50).map((item, i) => (
            <div key={i} className='space-y-2 rounded-md border p-3'>
              <div className='flex flex-wrap items-center gap-3 text-xs'>
                <span>Item {i + 1}</span>
                <button
                  type='button'
                  className='underline disabled:opacity-40'
                  disabled={disabled || i === 0}
                  aria-label={`Move ${field.label} item ${i + 1} up`}
                  onClick={() =>
                    edit({ type: 'move', path, from: i, to: i - 1 })
                  }
                >
                  Move up
                </button>
                <button
                  type='button'
                  className='underline disabled:opacity-40'
                  disabled={
                    disabled || i === (value as ConfigValue[]).length - 1
                  }
                  aria-label={`Move ${field.label} item ${i + 1} down`}
                  onClick={() =>
                    edit({ type: 'move', path, from: i, to: i + 1 })
                  }
                >
                  Move down
                </button>
                <button
                  type='button'
                  disabled={disabled}
                  className='underline'
                  aria-label={`Remove ${field.label} item ${i + 1}`}
                  onClick={() =>
                    remove([...path, i], `${field.label} item ${i + 1}`)
                  }
                >
                  Remove item
                </button>
              </div>
              {child(
                {
                  ...field.items!,
                  label: `${field.items!.label} ${i + 1}`,
                  required: true,
                },
                item,
                [...path, i],
              )}
            </div>
          ))}
          {(value as ConfigValue[]).length > 50 && (
            <p className='text-sm'>
              Showing 50 items. Use YAML to edit the remaining items.
            </p>
          )}
          <Button
            type='button'
            variant='outline'
            disabled={
              disabled ||
              (value as ConfigValue[]).length >=
                Math.min(field.maxLength ?? 200, 200)
            }
            onClick={() =>
              edit({ type: 'append', path, value: newValue(field.items!) })
            }
          >
            Add item to {field.label}
          </Button>
        </div>
      : map ?
        <div className='space-y-4'>
          {Object.entries(value as Record<string, ConfigValue>)
            .slice(0, 50)
            .map(([k, v]) => (
              <div key={k} className='rounded-md border p-3'>
                <label className='block text-xs'>
                  Key in {field.label}
                  <Input
                    aria-label={`Key ${k} in ${field.label}`}
                    defaultValue={k}
                    disabled={disabled}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value !== k) {
                        if (
                          !validMapKey(e.target.value, field.keyMode) ||
                          Object.hasOwn(value as object, e.target.value)
                        ) {
                          setLocalError('Use a valid, unique map key.');
                          e.target.value = k;
                        } else {
                          setLocalError('');
                          edit({
                            type: 'rename',
                            path,
                            from: k,
                            to: e.target.value,
                            keyMode: field.keyMode,
                          });
                        }
                      }
                    }}
                  />
                </label>
                {child({ ...field.items!, label: k, required: true }, v, [
                  ...path,
                  k,
                ])}
                <button
                  type='button'
                  disabled={disabled}
                  className='mt-3 text-xs underline'
                  onClick={() => remove([...path, k], k)}
                >
                  Remove {k}
                </button>
              </div>
            ))}
          {Object.keys(value as object).length > 50 && (
            <p className='text-sm'>
              Showing 50 keys. Use YAML for the remaining keys.
            </p>
          )}
          <label className='block text-sm'>
            New key in {field.label}
            <Input
              value={keyDraft}
              disabled={disabled}
              onChange={(e) => setKeyDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
            />
          </label>
          <Button
            type='button'
            variant='outline'
            disabled={disabled || Object.keys(value as object).length >= 200}
            onClick={() => {
              if (
                !validMapKey(keyDraft, field.keyMode) ||
                Object.hasOwn(value as object, keyDraft)
              ) {
                setLocalError('Use a valid, unique map key.');
                return;
              }
              edit({
                type: 'set',
                path: [...path, keyDraft],
                value: newValue(field.items!),
              });
              setKeyDraft('');
              setLocalError('');
            }}
          >
            Add key to {field.label}
          </Button>
        </div>
      : field.type === 'boolean' ?
        <select
          id={id}
          className={selectClass}
          disabled={disabled}
          value={String(value)}
          onChange={(e) => set(e.target.value === 'true')}
          aria-describedby={`${id}-help ${id}-issues`}
        >
          <option value='true'>Enabled</option>
          <option value='false'>Disabled</option>
        </select>
      : field.type === 'enum' ?
        <select
          id={id}
          className={selectClass}
          disabled={disabled}
          value={JSON.stringify(value)}
          onChange={(e) => set(JSON.parse(e.target.value) as ConfigValue)}
        >
          {field.options!.map((o, i) => (
            <option key={i} value={JSON.stringify(o)}>
              {String(o)}
            </option>
          ))}
        </select>
      : <Input
          id={id}
          key={JSON.stringify(value)}
          disabled={disabled}
          type={field.type === 'number' ? 'number' : 'text'}
          step={field.integer ? 1 : 'any'}
          defaultValue={
            field.type === 'scalar' ?
              JSON.stringify(value)
            : String(value ?? '')
          }
          aria-invalid={
            issues.some((i) => i.severity === 'error') || !!localError
          }
          aria-describedby={`${id}-help ${id}-issues`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            const text = e.target.value;
            let next: ConfigValue = text;
            if (field.type === 'number') {
              if (!text.trim() || !Number.isFinite(Number(text))) {
                e.currentTarget.setCustomValidity('Enter a finite number.');
                setLocalError('Enter a finite number.');
                return;
              }
              next = Number(text);
            }
            if (field.type === 'scalar') {
              try {
                next = JSON.parse(text) as ConfigValue;
              } catch {
                next = text;
              }
              if (next !== null && typeof next === 'object') {
                e.currentTarget.setCustomValidity(
                  'Enter a string, number, boolean or null.',
                );
                setLocalError('Enter a string, number, boolean or null.');
                return;
              }
            }
            e.currentTarget.setCustomValidity('');
            set(next);
          }}
        />
      }
      <div id={`${id}-issues`} aria-live='polite'>
        {issues.map((i, n) => (
          <p
            key={n}
            className={`text-sm ${i.severity === 'error' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}
          >
            {i.severity === 'warning' ? 'Recommendation: ' : ''}
            {i.message}
          </p>
        ))}
        {localError && (
          <p role='alert' className='text-sm text-red-700 dark:text-red-400'>
            {localError}
          </p>
        )}
      </div>
    </section>
  );
}
