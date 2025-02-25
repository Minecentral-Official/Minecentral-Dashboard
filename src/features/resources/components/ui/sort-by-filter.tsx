'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResourceFilterContext } from '@/features/resources/context/resource-filter.context';
import sortStringToValue from '@/features/resources/util/sort-string-to-value';

export default function PluginSortFilter() {
  const { sortBy, setSortBy } = useResourceFilterContext();
  return (
    <Select
      value={sortBy}
      onValueChange={(e) => {
        setSortBy(sortStringToValue(e));
      }}
    >
      <SelectTrigger className='w-auto'>
        <p>
          <span className='font-bold'>{`Sort By:`}</span> <SelectValue />
        </p>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='relevance'>Relevance</SelectItem>
          <SelectItem value='downloads'>Downloads</SelectItem>
          <SelectItem value='date_published'>Date Published</SelectItem>
          <SelectItem value='date_updated'>Date Updated</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
