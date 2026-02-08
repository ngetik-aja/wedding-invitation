"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import { CustomizeHeader } from "@/components/customize/customize-header";
import { CoupleForm } from "@/components/customize/forms/couple-form";
import { EventForm } from "@/components/customize/forms/event-form";
import { GalleryForm } from "@/components/customize/forms/gallery-form";
import { GiftForm } from "@/components/customize/forms/gift-form";
import { LocationForm } from "@/components/customize/forms/location-form";
import { MusicForm } from "@/components/customize/forms/music-form";
import { StoryForm } from "@/components/customize/forms/story-form";
import { ThemeForm } from "@/components/customize/forms/theme-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreateInvitation } from "@/hooks/mutations/use-create-invitation";
import { useCustomers } from "@/hooks/queries/use-customers";
import {
	type CustomerFormValues,
	customerFormSchema,
} from "@/lib/customer-form-schema";
import { cn } from "@/lib/utils";
import { defaultWeddingData, type ThemeKey, themes } from "@/lib/wedding-data";
import {
	type WeddingFormValues,
	weddingFormSchema,
} from "@/lib/wedding-form-schema";

const sections = [
	{ id: "couple", label: "Data Pengantin" },
	{ id: "event", label: "Acara" },
	{ id: "location", label: "Lokasi" },
	{ id: "gallery", label: "Galeri Foto" },
	{ id: "story", label: "Kisah Cinta" },
	{ id: "gift", label: "Amplop Digital" },
	{ id: "theme", label: "Tema & Warna" },
	{ id: "music", label: "Musik" },
];

const paidStatuses = new Set(["paid"]);
const isPaidCustomer = (status?: string) => {
	const normalized = (status ?? "").trim().toLowerCase();
	return paidStatuses.has(normalized);
};

export default function NewInvitationPage() {
	const router = useRouter();
	const { data: customerData } = useCustomers();
	const createInvitation = useCreateInvitation();

	const [activeSection, setActiveSection] = useState("couple");
	const [error, setError] = useState<string | null>(null);

	const weddingForm = useForm<WeddingFormValues>({
		resolver: zodResolver(weddingFormSchema),
		defaultValues: { ...defaultWeddingData, isPublished: false },
		mode: "onBlur",
	});

	const customerForm = useForm<CustomerFormValues>({
		resolver: zodResolver(customerFormSchema),
		defaultValues: {
			selectedCustomerId: undefined,
		},
		mode: "onBlur",
	});

	const weddingData = useWatch({ control: weddingForm.control });
	const isSubmitting = createInvitation.isPending;

	const paidCustomerOptions = useMemo(() => {
		return (customerData?.items ?? [])
			.filter((item) => isPaidCustomer(item.status))
			.map((item) => ({
				value: item.id,
				label: `${item.full_name} (${item.email})`,
			}));
	}, [customerData]);

	const previewUrl = useMemo(() => {
		return process.env.NEXT_PUBLIC_PREVIEW_URL || "http://localhost:3000/preview";
	}, []);

	const derivedTitle = useMemo(() => {
		const groom = weddingData?.couple?.groomName?.trim() || "";
		const bride = weddingData?.couple?.brideName?.trim() || "";
		if (groom && bride) return `${groom} & ${bride}`;
		return undefined;
	}, [weddingData]);

	const handleSave = async () => {
		setError(null);

		const customerValid = await customerForm.trigger();
		const weddingValid = await weddingForm.trigger();
		if (!customerValid || !weddingValid) {
			setError("Periksa kembali data yang belum lengkap.");
			return;
		}

		const customerValues = customerForm.getValues();
		const weddingValues = weddingForm.getValues();
		const content = { ...(weddingValues as WeddingFormValues) };
		delete (content as { isPublished?: boolean }).isPublished;

		if (!customerValues.selectedCustomerId) {
			setError("Pilih pelanggan terlebih dahulu.");
			return;
		}

		const selectedCustomer = (customerData?.items ?? []).find(
			(item) => item.id === customerValues.selectedCustomerId,
		);
		if (!selectedCustomer || !isPaidCustomer(selectedCustomer.status)) {
			setError("Pelanggan belum melakukan pembayaran.");
			return;
		}

		createInvitation.mutate(
			{
				customerId: customerValues.selectedCustomerId,
				title: derivedTitle,
				eventDate:
					weddingValues.event.akadDate ||
					weddingValues.event.resepsiDate ||
					undefined,
				themeKey: weddingValues.theme.theme,
				content: content as unknown as Record<string, unknown>,
			},
			{
				onSuccess: (data) => {
					const invitationId = data?.id;
					if (invitationId) {
						router.push(`/invitations/${invitationId}`);
						return;
					}
					router.push("/invitations");
				},
				onError: () => setError("Gagal membuat undangan."),
			},
		);
	};

	const currentTheme =
		themes[weddingData?.theme?.theme as ThemeKey] || themes.elegant;

	const renderForm = () => {
		switch (activeSection) {
			case "couple":
				return <CoupleForm />;
			case "event":
				return <EventForm />;
			case "location":
				return <LocationForm />;
			case "gallery":
				return <GalleryForm />;
			case "story":
				return <StoryForm />;
			case "gift":
				return <GiftForm />;
			case "theme":
				return <ThemeForm />;
			case "music":
				return <MusicForm />;
			default:
				return null;
		}
	};

	return (
		<FormProvider {...weddingForm}>
			<div className="bg-background">
				<CustomizeHeader
					onSave={handleSave}
					isSaving={isSubmitting}
					title="Buat Undangan"
					subtitle="Isi data undangan dengan mudah"
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
													: "text-muted-foreground hover:text-foreground hover:bg-secondary",
											)}
										>
											{section.label}
										</button>
									</li>
								))}
							</ul>
						</nav>

						<div className="p-4 border-t border-border mt-auto">
							<div className="text-xs text-muted-foreground mb-1">
								Tema Aktif
							</div>
							<div className="font-medium text-foreground">
								{currentTheme.name}
							</div>
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
												: "text-muted-foreground hover:bg-secondary",
										)}
									>
										{section.label}
									</button>
								))}
							</div>
						</div>

						<div className="lg:flex max-w-xs md:max-w-full">
							<div className="flex-1 lg:max-w-2xl p-4 sm:p-6 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Data Pelanggan</CardTitle>
										<CardDescription>
											Isi data pelanggan dengan bahasa yang mudah dipahami.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
									<p className="text-sm text-muted-foreground">
										Pilih pelanggan yang sudah terdaftar dan sudah bayar.
									</p>
									<div className="grid gap-2">
										<Label>Pilih Pelanggan</Label>
										<Controller
											control={customerForm.control}
											name="selectedCustomerId"
											render={({ field }) => (
												<Select
													classNamePrefix="react-select"
													placeholder="Cari nama pelanggan..."
													options={paidCustomerOptions}
													value={
														paidCustomerOptions.find(
															(option) => option.value === field.value,
														) || null
													}
													onChange={(option) =>
													field.onChange(option ? option.value : undefined)
												}
												/>
											)}
										/>
										{paidCustomerOptions.length === 0 && (
											<p className="text-sm text-muted-foreground">
												Belum ada pelanggan berstatus paid.
											</p>
										)}
										{customerForm.formState.errors.selectedCustomerId && (
											<p className="text-sm text-destructive">
												{customerForm.formState.errors.selectedCustomerId.message}
											</p>
										)}
									</div>
								</CardContent>
								</Card>

								{renderForm()}

								<div className="lg:hidden">
									<Button variant="outline" className="w-full" asChild>
										<a
											href={previewUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Buka Pratinjau
										</a>
									</Button>
								</div>

								{error && <p className="text-sm text-destructive">{error}</p>}

								<div className="flex flex-wrap gap-3">
									<Button onClick={handleSave} disabled={isSubmitting}>
										Simpan
									</Button>
								</div>
							</div>

              <div className="hidden lg:flex flex-1 flex-col border-l border-border bg-muted/30 sticky top-0 h-screen">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
									<div className="font-medium text-foreground">Pratinjau</div>
									<Button variant="outline" size="sm" asChild>
										<a
											href={previewUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Buka Pratinjau
										</a>
									</Button>
								</div>
                <div className="flex-1 h-screen overflow-auto px-6">
                  <div className="flex h-screen justify-center py-6">
                    <div className="bg-background rounded-2xl shadow-lg overflow-hidden w-full max-w-[420px] h-screen">
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
  );
}
