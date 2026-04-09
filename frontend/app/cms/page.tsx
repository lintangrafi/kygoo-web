import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CmsIndexPage() {
  const cookieStore = await cookies();
  const cmsSession = cookieStore.get('cms_logged_in')?.value === 'true';
  redirect(cmsSession ? '/cms/dashboard' : '/auth/login');
}
