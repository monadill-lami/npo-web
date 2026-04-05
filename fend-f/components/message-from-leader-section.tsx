import Image from "next/image"
import { Quote } from "lucide-react"
import { getLeaderMessage } from "@/lib/api"

export async function MessageFromLeaderSection() {
  const leaderMessage = await getLeaderMessage()

  const presidentName = leaderMessage?.presidentName || "President"
  const presidentDesignation = leaderMessage?.presidentDesignation || "Future Leaders Assembly Bangladesh (FLABD)"
  const message =
    leaderMessage?.message ||
    "At Future Leaders Assembly Bangladesh, we believe leadership starts with service. Every activity we run is designed to build confident, compassionate, and responsible young people who can create meaningful change in their communities. I invite you to stand with us as we continue to empower future leaders through collaboration, education, and social action. Your trust, time, and support inspire us to go further every day."
  const imageSrc = leaderMessage?.imageUrl || "/1000023394-5-884x1024.png"

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-muted shadow-2xl shadow-primary/10 p-6 sm:p-10 md:p-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Message From Our Leader</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            <div className="relative mx-auto lg:mx-0 w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-xl">
              <Image src={imageSrc || "/placeholder.svg"} alt={`${presidentName} portrait`} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/45 via-transparent to-transparent" />
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                A Message from the Leaders
              </h2>

              <div className="relative">
                <Quote className="w-10 h-10 text-primary/30 absolute -top-5 left-0" />
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line pl-10 pt-2">{message}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/70">
                <p className="text-foreground font-bold text-2xl">{presidentName}</p>
                <p className="text-primary font-semibold">{presidentDesignation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
