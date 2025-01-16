import TicketCreateForm from '@/features/tickets/components/create-form.ticket';

export default function AccountPage() {
  return (
    <div>
      <h1 className='mb-6 text-3xl font-bold'>Create New Ticket</h1>
      <TicketCreateForm />
    </div>
  );
}
