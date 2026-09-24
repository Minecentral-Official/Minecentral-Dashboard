export type WorkspaceFormState = {
  error?: string;
  message?: string;
  fields?: Record<string, string>;
};
export type WorkspaceFormAction = (
  state: WorkspaceFormState,
  data: FormData,
) => Promise<WorkspaceFormState>;
