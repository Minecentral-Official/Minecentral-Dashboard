import CreateTicketForm from '@/features/tickets/components/forms/create-ticket.form';

export default function AccountPage() {
  return (
    <div>
      <h1 className='mb-6 text-3xl font-bold'>Create New Ticket</h1>
      <CreateTicketForm />
    </div>
  );
}
