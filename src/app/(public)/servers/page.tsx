import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';

export default function Page() {
  return (
    <SidebarWrapper
      sidebar={
        <div className='flex h-full flex-col justify-start gap-4 pt-2'>
          test
        </div>
      }
    >
      <main className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
        Coming Soon
      </main>
    </SidebarWrapper>
  );
}
