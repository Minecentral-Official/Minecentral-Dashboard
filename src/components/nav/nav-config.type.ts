export type NavigationConfig = (
  | {
      title: string;
      href: string;
      items?: undefined;
      Icon?: React.ElementType;
    }
  | {
      title: string;
      Icon?: React.ElementType;
      items: {
        title: string;
        href: string;
        Icon?: React.ElementType;
      }[];
      href?: undefined;
    }
)[];
