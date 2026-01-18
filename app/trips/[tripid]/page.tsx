import { auth } from '@/auth';
import TripDetailClient, { TripWithLocations } from '@/components/trip-detail';
import { prisma } from '@/lib/prisma';

export default async function TripDetail({ params }: { params: Promise<{ tripid: string }> }) {
  const { tripid } = await params;
  const session = await auth();
  if (!session) {
    return <div>Please Sign In.</div>;
  }
  const trip = await prisma.trip.findFirst({
    where: { id: tripid, userId: session.user?.id },
    include: { locations: true },
  });

  console.log(trip);

  if (!trip) {
    return <div> Trip not found.</div>;
  }

  return <TripDetailClient trip={trip} />;
}
