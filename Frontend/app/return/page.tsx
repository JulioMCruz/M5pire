import { Metadata } from 'next'
import HeaderComponent from '@/components/Header';
import ItemReturnComponent from '@/components/ItemReturn';

export const metadata: Metadata = {
  title: `SocialFi`
}

export default function ReturnPage() {
  return (
    <div>
      <HeaderComponent />
    <ItemReturnComponent />
    </div>
  );
}