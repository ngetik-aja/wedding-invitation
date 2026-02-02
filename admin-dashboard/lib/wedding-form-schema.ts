import { z } from "zod"

const stringField = z.string().optional()

const baseSchema = z.object({
  couple: z.object({
    groomName: stringField,
    groomFullName: stringField,
    groomFather: stringField,
    groomMother: stringField,
    groomPhoto: stringField,
    brideName: stringField,
    brideFullName: stringField,
    brideFather: stringField,
    brideMother: stringField,
    bridePhoto: stringField,
  }),
  event: z.object({
    akadDate: stringField,
    akadTime: stringField,
    akadEndTime: stringField,
    resepsiDate: stringField,
    resepsiTime: stringField,
    resepsiEndTime: stringField,
  }),
  location: z.object({
    akadVenue: stringField,
    akadAddress: stringField,
    akadMapsUrl: stringField,
    resepsiVenue: stringField,
    resepsiAddress: stringField,
    resepsiMapsUrl: stringField,
  }),
  gallery: z.object({
    photos: z.array(z.string()),
  }),
  story: z.object({
    stories: z.array(
      z.object({
        title: stringField,
        date: stringField,
        description: stringField,
      })
    ),
  }),
  gift: z.object({
    banks: z.array(
      z.object({
        bankName: stringField,
        accountNumber: stringField,
        accountName: stringField,
      })
    ),
  }),
  theme: z.object({
    theme: z.string(),
    primaryColor: stringField,
  }),
  music: z.object({
    enabled: z.boolean(),
    selectedMusic: z.string(),
    customMusicUrl: stringField,
  }),
})

export const weddingFormSchema = baseSchema.extend({
  isPublished: z.boolean().optional(),
})

export type WeddingFormValues = z.infer<typeof weddingFormSchema>
