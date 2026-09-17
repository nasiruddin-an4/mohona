import { redirect } from 'next/navigation';

export default async function OutletHome({ params }) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.outlet}/menu`);
}
