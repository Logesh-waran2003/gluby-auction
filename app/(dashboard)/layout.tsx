import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Navbar } from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar user={session.user} />
      <main>
        <div className='bg-white rounded-lg shadow-md'>{children}</div>
      </main>
    </div>
  );
}
