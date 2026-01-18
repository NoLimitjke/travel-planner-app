'use server';

import { auth } from '@/auth';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';

export async function CreateTrip(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error('Not autheticated');
  }

  const title = formData.get('title')?.toString();
  const description = formData.get('description')?.toString();
  const startDateStr = formData.get('startDate')?.toString();
  const imageUrl = formData.get('imageUrl')?.toString();
  const endDateStr = formData.get('endDate')?.toString();

  if (!title || !description || !startDateStr || !endDateStr) {
    throw new Error('All fields required');
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  await prisma.trip.create({
    data: {
      title,
      description,
      startDate,
      endDate,
      userId: session.user.id,
      imageUrl,
    },
  });

  redirect('/trips');
}
