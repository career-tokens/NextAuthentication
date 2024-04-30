
import Navbar from '@/components/Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
          <Navbar/>
            {children}
    </>
  );
}
