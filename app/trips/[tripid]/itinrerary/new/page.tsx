import NewLocationClient from '@/components/new-location';

export default function NewLocation({ params }: { params: { tripid: string } }) {
  const { tripid } = params;
  return <NewLocationClient tripId={tripid} />;
}
