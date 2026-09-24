import * as React from 'react';

export function useMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Synchronize initial state with the browser/external widget after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
