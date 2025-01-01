export type NavigationConfig = (
  | {
      title: string;
      href: string;
      description: string;
      items?: undefined;
    }
  | {
      title: string;
      description: string;
      items: {
        title: string;
        href: string;
        disabled?: boolean;
      }[];
      href?: undefined;
    }
)[];
