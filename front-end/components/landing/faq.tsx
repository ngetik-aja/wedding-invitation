"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Berapa lama waktu pembuatan undangan?",
    answer:
      "Undangan Anda bisa langsung jadi dalam hitungan menit! Cukup pilih template, isi informasi, dan undangan siap dibagikan. Untuk kustomisasi lebih lanjut, mungkin membutuhkan waktu 1-2 jam.",
  },
  {
    question: "Apakah undangan bisa diedit setelah dibuat?",
    answer:
      "Ya, tentu saja! Anda bisa mengedit undangan kapan saja sebelum dan sesudah hari pernikahan. Perubahan akan langsung terlihat oleh tamu yang mengakses undangan.",
  },
  {
    question: "Bagaimana cara membagikan undangan ke tamu?",
    answer:
      "Setiap undangan memiliki link unik yang bisa Anda bagikan via WhatsApp, SMS, email, atau media sosial. Anda juga bisa personalisasi link dengan nama tamu untuk pengalaman yang lebih personal.",
  },
  {
    question: "Apakah ada batasan jumlah tamu yang bisa menerima undangan?",
    answer:
      "Tidak ada batasan! Undangan digital bisa dibagikan ke berapa pun tamu yang Anda undang tanpa biaya tambahan.",
  },
  {
    question: "Berapa lama undangan aktif?",
    answer:
      "Undangan Anda akan aktif selamanya tanpa biaya perpanjangan. Ini berarti tamu bisa mengakses undangan kapan saja, bahkan setelah hari pernikahan untuk nostalgia.",
  },
  {
    question: "Apakah bisa menggunakan domain sendiri?",
    answer:
      "Ya, untuk paket Exclusive Anda bisa menggunakan domain custom seperti 'nikah.johndoe.com'. Untuk paket lain, undangan akan menggunakan subdomain kami.",
  },
  {
    question: "Bagaimana dengan keamanan data saya?",
    answer:
      "Keamanan data Anda adalah prioritas kami. Semua informasi dienkripsi dan disimpan dengan aman. Kami tidak pernah membagikan data Anda ke pihak ketiga.",
  },
  {
    question: "Apakah ada garansi uang kembali?",
    answer:
      "Ya! Kami memberikan garansi uang kembali 7 hari jika Anda tidak puas dengan layanan kami. Tanpa pertanyaan, tanpa ribet.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
            FAQ
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-muted-foreground">
            Temukan jawaban untuk pertanyaan umum tentang layanan kami.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
