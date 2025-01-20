export interface WikiContent {
  data: {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  contentHtml: string;
}
