'use client';

import { Suspense, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function SearchParamTriggerSonner() {
  return (
    <Suspense>
      <SearchParamTriggerSonnerContent />
    </Suspense>
  );
}

function SearchParamTriggerSonnerContent() {
  const searchParams = useSearchParams();
  const toastSuccess = searchParams.get('toast-success');
  const toastMessage = searchParams.get('toast-message');
  const toastId = searchParams.get('toast-id');

  useEffect(() => {
    if (toastSuccess === 'true' && toastMessage && toastId) {
      const decodedToastMessage = decodeURIComponent(toastMessage);
      toast.success(decodedToastMessage, { id: toastId });
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('toast-success');
    url.searchParams.delete('toast-message');
    url.searchParams.delete('toast-id');
    window.history.replaceState({}, '', url.toString());
  }, [toastSuccess, toastMessage, toastId]);

  return <></>;
}
