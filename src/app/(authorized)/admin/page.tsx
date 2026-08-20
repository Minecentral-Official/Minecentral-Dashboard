
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard() {
  return (
    <Card className='col-span-2 md:col-span-1'>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mt-6 grid grid-cols-3 gap-4'>
          {/* <div className='flex flex-col items-center'>
            <EarthIcon className='mb-2 h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>0</span>
            <span className='text-sm text-muted-foreground'>Worlds Listed</span>
          </div>
          <div className='flex flex-col items-center'>
            <Plugin className='mb-2 h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>0</span>
            <span className='text-sm text-muted-foreground'>
              Resources Posted
            </span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
