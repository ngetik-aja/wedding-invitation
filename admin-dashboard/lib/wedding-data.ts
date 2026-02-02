export interface WeddingData {
  couple: {
    groomName: string
    groomFullName: string
    groomFather: string
    groomMother: string
    groomPhoto: string
    brideName: string
    brideFullName: string
    brideFather: string
    brideMother: string
    bridePhoto: string
  }
  event: {
    akadDate: string
    akadTime: string
    akadEndTime: string
    resepsiDate: string
    resepsiTime: string
    resepsiEndTime: string
  }
  location: {
    akadVenue: string
    akadAddress: string
    akadMapsUrl: string
    resepsiVenue: string
    resepsiAddress: string
    resepsiMapsUrl: string
  }
  gallery: {
    photos: string[]
  }
  story: {
    stories: { title: string; date: string; description: string }[]
  }
  gift: {
    banks: { bankName: string; accountNumber: string; accountName: string }[]
  }
  theme: {
    theme: string
    primaryColor: string
  }
  music: {
    enabled: boolean
    selectedMusic: string
    customMusicUrl: string
  }
}

export const themes = {
  elegant: {
    name: "Elegant Rose",
    description: "Pink dan krem romantis",
  },
  rustic: {
    name: "Rustic Garden",
    description: "Hijau dan cokelat natural",
  },
  modern: {
    name: "Modern Minimalist",
    description: "Hitam putih dan emas",
  },
  gold: {
    name: "Classic Gold",
    description: "Emas mewah klasik",
  },
  tropical: {
    name: "Tropical Paradise",
    description: "Tosca dan coral pantai",
  },
  floral: {
    name: "Floral Dream",
    description: "Pastel watercolor bunga",
  },
}

export type ThemeKey = keyof typeof themes

export const defaultWeddingData: WeddingData = {
  couple: {
    groomName: "",
    groomFullName: "",
    groomFather: "",
    groomMother: "",
    groomPhoto: "",
    brideName: "",
    brideFullName: "",
    brideFather: "",
    brideMother: "",
    bridePhoto: "",
  },
  event: {
    akadDate: "",
    akadTime: "",
    akadEndTime: "",
    resepsiDate: "",
    resepsiTime: "",
    resepsiEndTime: "",
  },
  location: {
    akadVenue: "",
    akadAddress: "",
    akadMapsUrl: "",
    resepsiVenue: "",
    resepsiAddress: "",
    resepsiMapsUrl: "",
  },
  gallery: {
    photos: [],
  },
  story: {
    stories: [],
  },
  gift: {
    banks: [],
  },
  theme: {
    theme: "elegant",
    primaryColor: "rose",
  },
  music: {
    enabled: true,
    selectedMusic: "mixkit-wedding-01",
    customMusicUrl: "",
  },
}
