import { getSession } from '../../../library/auth';
import { redirect } from 'next/navigation';
import { createConnection } from '../../../library/db';
import { logout } from '../../../library/actions';

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const db = await createConnection();
  const [rows] = await db.execute('SELECT full_name, created_at, email, location FROM users WHERE id = ?', [session.userId]);
  const user = rows[0];

  if (!user) {
    // Session is valid but user deleted? Clear session.
    redirect('/login');
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account settings.</p>
          </div>
          <form action={logout}>
            <button type="submit" className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition font-medium text-sm border border-red-100">
              Logout
            </button>
          </form>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">{user.full_name}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            {user.location && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.location}</dd>
              </div>
            )}
            <div className={`${user.location ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-200`}>
              <dt className="text-sm font-medium text-gray-500">Member since</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{joinDate}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
