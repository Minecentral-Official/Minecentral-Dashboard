'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { ProjectsUserTable } from '@/features/resources/components/resource/table/project-list-table';
import { resourcesListFilterApiResponseZod } from '@/features/resources/schemas/zod/resources-list-filter-api-request.zod';
import { S_ResourceListAll } from '@/features/resources/schemas/zod/s-resource-list-all.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { SearchParamsConsume } from '@/hooks/use-update-search-params';

export default function Page() {
  const searchParams = useSearchParams();
  const { limit, page } = S_ResourceListAll.parse({
    limit: searchParams.get('limit'),
    page: searchParams.get('p'),
  });

  const [resources, setResources] = useState<T_DTOResource[]>([]);

  useEffect(() => {
    // updateSearchParams({ q: searchQuery });
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  //Performs the search query, returning and updating the plugins to be shown to user
  const performSearch = async () => {
    const params = new URLSearchParams();
    SearchParamsConsume(params, {
      p: page > 0 ? page.toString() : null,
      limit: limit != 16 ? limit.toString() : null,
    });
    fetch(`/api/resources/all?${params.toString()}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const parse = resourcesListFilterApiResponseZod.safeParse(json);
        if (parse.success) setResources(parse.data.resources);
        else {
          toast.error('Query error:' + parse.error);
        }
      });
  };

  return (
    <>
      <ProjectsUserTable plugins={resources} />
    </>
  );
}
