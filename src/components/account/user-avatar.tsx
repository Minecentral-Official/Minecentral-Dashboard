import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DataAvatar from '@/lib/auth/components/avatar/data.avatar';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function UserProfile() {
  const {
    user: { name, email },
  } = await validateSession();
  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center space-x-4'>
        <DataAvatar />
        <div>
          <h2 className='text-2xl font-bold'>{name}</h2>
          <p className='text-gray-500'>{email}</p>
          <Button variant='outline' className='mt-2'>
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
