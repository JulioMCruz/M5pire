import { Metadata } from 'next'
import MyRental from './MyRentals'

export const metadata: Metadata = {
  title: `MyRental`
}

export default function ProfilePage() {
  return <MyRental />
}
