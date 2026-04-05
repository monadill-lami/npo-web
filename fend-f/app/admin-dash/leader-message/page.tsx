import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"
import { LeaderMessageForm } from "@/components/leader-message-form"
import { getLeaderMessage } from "@/lib/api"

export const metadata = {
  title: "Leader Message | Admin Dashboard",
}

export default async function AdminLeaderMessagePage() {
  const leaderMessage = await getLeaderMessage()

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <AdminMobileNav />

          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Message From Leader</h1>
              <p className="text-[#1D4ED8] mt-2">Update the president message and photo shown on homepage.</p>
            </div>

            <LeaderMessageForm initialData={leaderMessage} />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
