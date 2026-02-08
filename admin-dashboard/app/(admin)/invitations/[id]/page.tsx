"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { FormProvider, Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CustomizeHeader } from "@/components/customize/customize-header"
import { CoupleForm } from "@/components/customize/forms/couple-form"
import { EventForm } from "@/components/customize/forms/event-form"
import { GalleryForm } from "@/components/customize/forms/gallery-form"
import { GiftForm } from "@/components/customize/forms/gift-form"
import { LocationForm } from "@/components/customize/forms/location-form"
import { MusicForm } from "@/components/customize/forms/music-form"
import { StoryForm } from "@/components/customize/forms/story-form"
import { ThemeForm } from "@/components/customize/forms/theme-form"
import { cn } from "@/lib/utils"
import { defaultWeddingData, themes, type ThemeKey } from "@/lib/wedding-data"
import { weddingFormSchema, type WeddingFormValues } from "@/lib/wedding-form-schema"
import { useDeleteInvitation } from "@/hooks/mutations/use-delete-invitation"
import { useUpdateInvitation } from "@/hooks/mutations/use-update-invitation"
import { useInvitation } from "@/hooks/queries/use-invitation"

const sections = [
  { id: "couple", label: "Data Pengantin" },
  { id: "event", label: "Acara" },
  { id: "location", label: "Lokasi" },
  { id: "gallery", label: "Galeri Foto" },
  { id: "story", label: "Kisah Cinta" },
  { id: "gift", label: "Amplop Digital" },
  { id: "theme", label: "Tema & Warna" },
  { id: "music", label: "Musik" },
]

function mergeWeddingData(payload: Record<string, unknown> | null | undefined): WeddingFormValues {
  if (!payload) return { ...defaultWeddingData, isPublished: false }
  return {
    ...defaultWeddingData,
    ...(payload as WeddingFormValues),
  }
}

export default function InvitationDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const invitationId = params?.id ?? ""
  const { data, isLoading } = useInvitation(invitationId)
  const { mutate: updateInvitation, isPending } = useUpdateInvitation(invitationId)
  const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation()

  const [activeSection, setActiveSection] = useState("couple")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: { ...defaultWeddingData, isPublished: false },
    mode: "onBlur",
  })

  const weddingValues = useWatch({ control: form.control })
  useEffect(() => {
    if (!data) return
    form.reset({
      ...mergeWeddingData(data.content),
      isPublished: data.isPublished,
    })
  }, [data, form])

  const previewUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_PREVIEW_URL || "http://localhost:3000/preview"
    if (invitationId) return `${base}?id=${invitationId}`
    return base
  }, [invitationId])

  const derivedTitle = useMemo(() => {
    const groom = weddingValues?.couple?.groomName?.trim() || ""
    const bride = weddingValues?.couple?.brideName?.trim() || ""
    if (groom && bride) return `${groom} & ${bride}`
    return undefined
  }, [weddingValues])

  const currentTheme =
    themes[weddingValues?.theme?.theme as ThemeKey] || themes.elegant

  const handleSave = async () => {
    setError(null)

    const valid = await form.trigger()
    if (!valid || !data) {
      setError("Periksa kembali data yang belum lengkap.")
      return
    }

    const values = form.getValues()
    const content = { ...(values as WeddingFormValues) }
    const publishStatus = Boolean(values.isPublished)
    delete (content as { isPublished?: boolean }).isPublished

    updateInvitation(
      {
        customerId: data.customerId,
        title: derivedTitle ?? data.title,
        eventDate: values.event.akadDate || values.event.resepsiDate || undefined,
        themeKey: values.theme.theme,
        isPublished: publishStatus,
        content: content as unknown as Record<string, unknown>,
      },
      {
        onError: () => setError("Gagal menyimpan perubahan."),
        onSuccess: () => router.push("/invitations"),
      }
    )
  }

  const handleDelete = () => {
    if (!confirm("Yakin hapus undangan ini?")) return
    deleteInvitation(invitationId, {
      onSuccess: () => router.push("/invitations"),
    })
  }

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        <div className="flex">
          <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-65px)]">
            <div className="p-4 border-b border-border space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </aside>

          <main className="flex-1">
            {/* Mobile Section Tabs */}
            <div className="lg:hidden sticky top-0 z-10 bg-card border-b border-border overflow-hidden">
              <div className="flex w-max gap-2 px-4 py-2 overflow-x-auto overscroll-x-contain">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:flex">
              <div className="flex-1 lg:max-w-2xl p-4 sm:p-6 space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-72 w-full" />
                <Skeleton className="h-72 w-full" />
              </div>

              <div className="hidden lg:flex flex-1 flex-col border-l border-border bg-muted/30 sticky top-0 h-dvh">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
                  <div className="font-medium text-foreground">Pratinjau</div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      Buka Pratinjau
                    </a>
                  </Button>
                </div>
                <div className="flex-1 min-h-0 overflow-auto px-6">
                  <div className="flex h-full justify-center">
                    <div className="bg-background rounded-2xl shadow-lg overflow-hidden w-full max-w-[420px] h-full">
                      <iframe src={previewUrl} className="w-full h-full border-0" title="Pratinjau" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="px-6 py-10 text-center text-sm text-muted-foreground">
        Data undangan tidak ditemukan.
      </div>
    )
  }

  const renderForm = () => {
    switch (activeSection) {
      case "couple":
        return <CoupleForm />
      case "event":
        return <EventForm />
      case "location":
        return <LocationForm />
      case "gallery":
        return <GalleryForm />
      case "story":
        return <StoryForm />
      case "gift":
        return <GiftForm />
      case "theme":
        return <ThemeForm />
      case "music":
        return <MusicForm />
      default:
        return null
    }
  }

  return (
    <FormProvider {...form}>
      <div className="bg-background">
        <CustomizeHeader
          onSave={handleSave}
          isSaving={isPending}
          title="Ubah Undangan"
          subtitle="Perbarui detail dan publikasikan undangan"
        />

        <div className="flex">
          <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-65px)] sticky top-[65px]">
            <div className="p-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-foreground">
                Kustomisasi
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Langkah demi langkah isi data
              </p>
            </div>
            <nav className="p-3">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-border mt-auto">
              <div className="text-xs text-muted-foreground mb-1">Tema Aktif</div>
              <div className="font-medium text-foreground">{currentTheme.name}</div>
            </div>
          </aside>

          <main className="flex-1">
            {/* Mobile Section Tabs */}
            <div className="lg:hidden sticky top-0 z-10 bg-card border-b border-border">
              <div className="flex max-w-xs gap-2 px-4 py-2 overflow-x-auto md:max-w-full">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:flex">
              <div className="flex-1 lg:max-w-2xl p-4 sm:p-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Publikasi</CardTitle>
                    <CardDescription>
                      Tampilkan undangan ke publik saat sudah siap.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <Label htmlFor="isPublished">Publikasikan Undangan</Label>
                        <p className="text-sm text-muted-foreground">
                          Status saat ini: {form.watch("isPublished") ? "Terpublikasi" : "Draft"}
                        </p>
                      </div>
                      <Controller
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                          <Switch
                            id="isPublished"
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {renderForm()}

                <div className="lg:hidden">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      Buka Pratinjau
                    </a>
                  </Button>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSave} disabled={isPending}>
                    Simpan
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </Button>
                </div>
              </div>

              <div className="hidden lg:flex flex-1 flex-col border-l border-border bg-muted/30 sticky top-0 h-dvh">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
                  <div className="font-medium text-foreground">Pratinjau</div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      Buka Pratinjau
                    </a>
                  </Button>
                </div>
                <div className="flex-1 min-h-0 overflow-auto px-6">
                  <div className="flex h-full justify-center">
                    <div className="bg-background rounded-2xl shadow-lg overflow-hidden w-full max-w-[420px] h-full">
                      <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title="Pratinjau"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </FormProvider>
  )
}
