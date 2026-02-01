"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateInvitation } from "@/hooks/mutations/use-create-invitation"

function encodePreview(data: string) {
  return encodeURIComponent(btoa(unescape(encodeURIComponent(data))))
}

export default function NewInvitationPage() {
  const router = useRouter()
  const { mutate, isPending } = useCreateInvitation()

  const [customerId, setTenantId] = useState("")
  const [slug, setSlug] = useState("")
  const [title, setTitle] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [themeKey, setThemeKey] = useState("elegant")
  const [isPublished, setIsPublished] = useState(false)
  const [content, setContent] = useState("{}")
  const [error, setError] = useState<string | null>(null)

  const previewUrl = useMemo(() => {
    try {
      JSON.parse(content)
      const base = process.env.NEXT_PUBLIC_PREVIEW_URL || "http://localhost:3000/preview"
      return `${base}?data=${encodePreview(content)}`
    } catch {
      return null
    }
  }, [content])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(content)
    } catch {
      setError("Content harus JSON valid.")
      return
    }

    mutate(
      {
        customerId,
        slug,
        title,
        eventDate: eventDate || undefined,
        themeKey,
        isPublished,
        content: parsed,
      },
      {
        onSuccess: () => router.push("/invitations"),
        onError: () => setError("Gagal menyimpan undangan."),
      }
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Buat Undangan</h1>
        <p className="text-muted-foreground">Isi data inti undangan baru.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Detail Undangan</CardTitle>
            <CardDescription>Metadata + JSON content untuk layout.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input id="customerId" value={customerId} onChange={(e) => setTenantId(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="themeKey">Theme Key</Label>
                  <Input id="themeKey" value={themeKey} onChange={(e) => setThemeKey(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isPublished">Published</Label>
                  <select
                    id="isPublished"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={isPublished ? "yes" : "no"}
                    onChange={(e) => setIsPublished(e.target.value === "yes")}
                  >
                    <option value="no">Draft</option>
                    <option value="yes">Published</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (JSON)</Label>
                <Textarea
                  id="content"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Undangan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Live preview dari JSON content.</CardDescription>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div className="space-y-3">
                <Button asChild variant="outline">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    Buka Preview
                  </a>
                </Button>
                <div className="aspect-[9/16] w-full overflow-hidden rounded-lg border">
                  <iframe
                    key={previewUrl}
                    src={previewUrl}
                    className="h-full w-full border-0"
                    title="Preview"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">JSON belum valid.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
