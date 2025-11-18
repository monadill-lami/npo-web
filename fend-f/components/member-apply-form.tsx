"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react"
import { submitMemberRequest } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const REQUIRED_WIDTH = 800
const REQUIRED_HEIGHT = 500

export function MemberApplyForm() {
  const { toast } = useToast()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [isPhotoValid, setIsPhotoValid] = useState(false)

  const [form, setForm] = useState({
    name: "",
    fathersName: "",
    mothersName: "",
    region: "",
    institution: "",
    address: "",
    email: "",
    phoneNumber: "",
    whyJoining: "",
    howDidYouFindUs: "",
    hobbies: "",
    particularSkill: "",
    extraCurricularActivities: "",
  })

  const required: (keyof typeof form)[] = [
    'name','fathersName','mothersName','region','institution','address','email','phoneNumber','whyJoining','howDidYouFindUs','hobbies'
  ]

  const onChange = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhoto(file)
    setIsPhotoValid(false)

    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          if (img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT) {
            setPhotoError(null)
            setIsPhotoValid(true)
          } else {
            setPhotoError(`Image must be ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT} pixels. Please resize and re-upload.`)
            setIsPhotoValid(false)
          }
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      setPhotoError("A photo is required.")
      setIsPhotoValid(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const k of required) {
      if (!form[k].trim()) {
        toast({ title: 'Missing field', description: `${k} is required`, variant: 'destructive' })
        return
      }
    }

    if (!photo) {
      toast({ title: 'Missing Photo', description: 'Please upload a photo.', variant: 'destructive' })
      setPhotoError("A photo is required.")
      return
    }

    if (!isPhotoValid) {
      toast({ title: 'Invalid Photo', description: photoError || 'Please upload a valid photo.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    const res = await submitMemberRequest({ ...form, photo })
    setIsSubmitting(false)
    if (res.ok) {
      toast({ title: 'Request submitted', description: 'We will review your application soon.' })
      router.push('/')
    } else {
      toast({ title: 'Error', description: res.error || 'Submission failed', variant: 'destructive' })
    }
  }

  return (
    <Card className="rounded-2xl border-none shadow-xl bg-white">
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => onChange('name', e.target.value)} />
            </div>
            <div>
              <Label>Father's Name *</Label>
              <Input value={form.fathersName} onChange={(e) => onChange('fathersName', e.target.value)} />
            </div>
            <div>
              <Label>Mother's Name *</Label>
              <Input value={form.mothersName} onChange={(e) => onChange('mothersName', e.target.value)} />
            </div>
            <div>
              <Label>Region *</Label>
              <Input value={form.region} onChange={(e) => onChange('region', e.target.value)} />
            </div>
            <div>
              <Label>Institution *</Label>
              <Input value={form.institution} onChange={(e) => onChange('institution', e.target.value)} />
            </div>
            <div>
              <Label>Address *</Label>
              <Input value={form.address} onChange={(e) => onChange('address', e.target.value)} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input value={form.phoneNumber} onChange={(e) => onChange('phoneNumber', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Why Joining *</Label>
              <Textarea value={form.whyJoining} onChange={(e) => onChange('whyJoining', e.target.value)} />
            </div>
            <div>
              <Label>How Did You Find Us? *</Label>
              <Textarea value={form.howDidYouFindUs} onChange={(e) => onChange('howDidYouFindUs', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Hobbies *</Label>
              <Input value={form.hobbies} onChange={(e) => onChange('hobbies', e.target.value)} />
            </div>
            <div>
              <Label>Particular Skill</Label>
              <Input value={form.particularSkill} onChange={(e) => onChange('particularSkill', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Extra Curricular Activities</Label>
              <Textarea value={form.extraCurricularActivities} onChange={(e) => onChange('extraCurricularActivities', e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Photo *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Please upload a photo with a clear background. The image must be exactly {REQUIRED_WIDTH}x{REQUIRED_HEIGHT} pixels.
            </p>
            <div className="flex flex-col gap-3">
              <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <Label htmlFor="photo-upload" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl w-full md:w-auto cursor-pointer")}>
                <Upload className="w-4 h-4 mr-2" /> {photo ? "Change Photo" : "Upload Photo"}
              </Label>
              {photo && (
                <div className="flex items-center gap-2 text-sm">
                  {isPhotoValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span>{photo.name}</span>
                </div>
              )}
              {photoError && <p className="text-sm text-red-500 mt-1">{photoError}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl">
              {isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>) : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

