import CreateResourceForm from '@/features/resource-plugin/components/forms/new-resource.form';

export default function Page() {
  return (
    <div className='h-full w-full' data-registry='plate'>
      <CreateResourceForm />
    </div>
  );
}
