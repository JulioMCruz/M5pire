import { Metadata } from 'next'
import SocialFi from './Social'
import HeaderComponent from '@/components/Header';

export const metadata: Metadata = {
  title: `SocialFi`
}

export default function SocialFiPage() {
  return (
    <div>
      <HeaderComponent />
      <SocialFi />
    </div>
  );
}
