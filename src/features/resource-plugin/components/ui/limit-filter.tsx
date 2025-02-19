'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useResourceFilterContext } from '@/features/resource-plugin/context/resource-filter.context';

export default function PluginLimitFilter() {
  const { limit, setLimit } = useResourceFilterContext();
  return (
    <Select
      value={limit.toString()}
      onValueChange={(e) => {
        setLimit(Number.parseInt(e.valueOf()));
      }}
    >
      <SelectTrigger className='w-[100px]'>
        <p>
          <span className='font-bold'>{`View:`}</span> {limit}
        </p>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='8'>8</SelectItem>
          <SelectItem value='12'>12</SelectItem>
          <SelectItem value='16'>16</SelectItem>
          <SelectItem value='32'>32</SelectItem>
          <SelectItem value='64'>64</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
