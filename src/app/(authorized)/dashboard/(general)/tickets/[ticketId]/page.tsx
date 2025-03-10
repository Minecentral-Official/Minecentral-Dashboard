import TicketDetails from '@/features/tickets/components/details.ticket';

type PageProps = {
  params: Promise<{ ticketId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { ticketId } = await params;
  return <TicketDetails ticketId={ticketId} />;
}
