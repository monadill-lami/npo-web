"use client"

import type React from "react"
import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateLeaderMessage } from "@/lib/api"

interface LeaderMessageFormProps {
  initialData?: {
    message?: string
    presidentName?: string
    presidentDesignation?: string
    imageUrl?: string
  } | null
}

export function LeaderMessageForm({ initialData }: LeaderMessageFormProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [presidentName, setPresidentName] = useState(initialData?.presidentName || "")
  const [presidentDesignation, setPresidentDesignation] = useState(initialData?.presidentDesignation || "")
  const [message, setMessage] = useState(initialData?.message || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)
  const [isSaving, setIsSaving] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be less than 5MB", variant: "destructive" })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" })
      return
    }

    setImageFile(file)
    setImageUrl("")
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImageUrl("")
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!presidentName.trim()) {
      toast({ title: "Name required", description: "Please enter the president's name", variant: "destructive" })
      return
    }
    if (!presidentDesignation.trim()) {
      toast({ title: "Designation required", description: "Please enter the designation", variant: "destructive" })
      return
    }
    if (!message.trim()) {
      toast({ title: "Message required", description: "Please enter the leader message", variant: "destructive" })
      return
    }

    setIsSaving(true)
    const formData = new FormData()
    formData.append("presidentName", presidentName)
    formData.append("presidentDesignation", presidentDesignation)
    formData.append("message", message)

    if (imageFile) {
      formData.append("image", imageFile)
    } else if (imageUrl.trim()) {
      formData.append("imageUrl", imageUrl.trim())
    }

    const result = await updateLeaderMessage(formData)
    setIsSaving(false)

    if (!result.ok) {
      toast({ title: "Save failed", description: result.error || "Could not update content", variant: "destructive" })
      return
    }

    if (result.leaderMessage?.imageUrl) {
      setImagePreview(result.leaderMessage.imageUrl)
      setImageUrl(result.leaderMessage.imageUrl)
      setImageFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }

    toast({ title: "Saved", description: "Leader message updated successfully." })
  }

  return (
    <Card className="rounded-2xl border-none shadow-xl bg-white">
      <CardContent className="p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="presidentName" className="text-[#1E3A8A] font-semibold">
                President Name
              </Label>
              <Input
                id="presidentName"
                value={presidentName}
                onChange={(e) => setPresidentName(e.target.value)}
                placeholder="Enter full name"
                className="h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presidentDesignation" className="text-[#1E3A8A] font-semibold">
                Designation
              </Label>
              <Input
                id="presidentDesignation"
                value={presidentDesignation}
                onChange={(e) => setPresidentDesignation(e.target.value)}
                placeholder="e.g. President, FLABD"
                className="h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#1E3A8A] font-semibold">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the message from the president..."
              className="min-h-[220px] rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#1E3A8A] font-semibold">President Photo</Label>

            {imagePreview && (
              <div className="relative w-full max-w-xs h-72 rounded-2xl overflow-hidden border border-[#BFDBFE] bg-[#F8FBFF]">
                <Image src={imagePreview || "/placeholder.svg"} alt="President preview" fill className="object-cover" />
                <Button
                  type="button"
                  size="icon"
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {!imagePreview && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  id="leader-image-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="leader-image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full max-w-md border-2 border-dashed border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl h-20 bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-5 h-5 mr-2" /> Upload Photo (Max 5MB)
                  </Button>
                </label>

                <div className="text-sm text-[#1D4ED8]">OR provide an image URL</div>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value)
                    if (e.target.value.trim()) {
                      setImagePreview(e.target.value.trim())
                    }
                  }}
                  placeholder="https://example.com/president.jpg"
                  className="h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] max-w-md"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="h-12 rounded-xl bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Leader Message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
