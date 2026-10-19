import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export function Placeholder({ title }: { title: string }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  return (
    <div className="flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {user && <p className="text-sm">Signed in as {user.email} ({user.role})</p>}
      <Button variant="secondary" onClick={logout}>
        Log out
      </Button>
    </div>
  )
}