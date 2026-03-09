import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — TIP Marketing',
  description: 'Masuk ke TIP Marketing',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
