import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const comparisonTableConfig = {
  caption: 'Effective as of November 21, 2024',
  data: {
    Minecentral: {
      'Dedicated CPU Cores': true,
      'Split Server Resources': true,
      'Multi User Support': true,
      'Price Per 8GB': 22,
    },
    'Bloom Host': {
      'Dedicated CPU Cores': true,
      'Split Server Resources': true,
      'Multi User Support': true,
      'Price Per 8GB': 24,
    },
    Shockbyte: {
      'Dedicated CPU Cores': false,
      'Split Server Resources': false,
      'Multi User Support': false,
      'Price Per 8GB': 32,
    },
    'Pebble Host': {
      'Dedicated CPU Cores': true,
      'Split Server Resources': false,
      'Multi User Support': false,
      'Price Per 8GB': 42,
    },
    'Apex Hosting': {
      'Dedicated CPU Cores': false,
      'Split Server Resources': true,
      'Multi User Support': false,
      'Price Per 8GB': 40,
    },
  },
};

export default function ComparisonSection() {
  const data = comparisonTableConfig.data;
  const dataArray = Object.values(data);
  const headerArray = Array.from(Object.keys(data));

  const rows = Array.from(
    Object.keys(data.Minecentral),
  ) as (keyof typeof data.Minecentral)[];

  const bodyArray = rows.map((row) => ({
    rowName: row,
    data: dataArray.map((item) => item[row]),
  }));

  console.log(bodyArray);

  return (
    <div className='w-full py-20 lg:py-40'>
      <div className='container mx-auto'>
        <div className='flex flex-col items-start gap-4 py-20 lg:py-40'>
          <div>
            <Badge>Comparisons</Badge>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='font-regular text-3xl tracking-tighter md:text-5xl lg:max-w-xl'>
              Something new!
            </h2>
            <p className='max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-xl'>
              Managing a small business today is already tough.
            </p>
          </div>
          <div className='flex w-full flex-col gap-10 pt-12'>
            <Table>
              <TableCaption>{comparisonTableConfig.caption}</TableCaption>
              <TableHeader>
                <TableRow className='border-none'>
                  <TableHead />
                  {headerArray.map((header, index) => (
                    <TableHead
                      key={header}
                      className={cn(
                        'border-l text-center',
                        index === 0 ?
                          'text-lg font-medium text-primary'
                        : undefined,
                      )}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {bodyArray.map(({ rowName, data }) => (
                  // using index here as this data is static and it will never be reordered
                  <TableRow key={rowName} className='border-none'>
                    <TableCell className='border-r'>{rowName}</TableCell>
                    {data.map((cell, index) => {
                      const contentType =
                        typeof cell === 'boolean' ? 'boolean' : 'number';

                      if (contentType === 'number') {
                        return (
                          <TableCell
                            key={index}
                            className={cn(
                              'text-center',
                              index !== 0 ? 'border-l' : undefined,
                            )}
                          >
                            $
                            <span
                              className={cn(
                                'text-lg',
                                index === 0 ? 'text-2xl' : undefined,
                              )}
                            >
                              {cell}
                            </span>
                            /mo
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          className={index !== 0 ? 'border-l' : undefined}
                          key={index}
                        >
                          {cell && <Check className='h-4 w-full text-center' />}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
