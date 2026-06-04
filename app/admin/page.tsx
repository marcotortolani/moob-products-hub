import { notFound } from 'next/navigation'
import AdminForm from './AdminForm'

export const metadata = { title: 'Admin — Moob Products HUB' }

export default function AdminPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }
  return <AdminForm />
}
