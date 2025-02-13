import CreateResourceForm from '@/features/resource/components/forms/new-resource.form';

export default function Page() {
  return (
    <div className='h-screen w-full' data-registry='plate'>
      <CreateResourceForm />
    </div>
  );
}
