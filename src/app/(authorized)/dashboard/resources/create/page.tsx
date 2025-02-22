import ResourceCreateForm from '@/features/resource-plugin/components/forms/new-resource.form';

export default function Page() {
  return (
    <div className='h-full' data-registry='plate'>
      <ResourceCreateForm />
    </div>
  );
}
