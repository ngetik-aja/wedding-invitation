"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: 1,
    name: "Elegant Rose",
    category: "Elegant",
    image: "/themes/elegant-rose.jpg",
    popular: true,
  },
  {
    id: 2,
    name: "Rustic Garden",
    category: "Rustic",
    image: "/themes/rustic-garden.jpg",
    popular: false,
  },
  {
    id: 3,
    name: "Modern Minimalist",
    category: "Modern",
    image: "/themes/modern-minimalist.jpg",
    popular: true,
  },
  {
    id: 4,
    name: "Classic Gold",
    category: "Classic",
    image: "/themes/classic-gold.jpg",
    popular: false,
  },
  {
    id: 5,
    name: "Tropical Paradise",
    category: "Tropical",
    image: "/themes/tropical-paradise.jpg",
    popular: false,
  },
  {
    id: 6,
    name: "Floral Dream",
    category: "Floral",
    image: "/themes/floral-dream.jpg",
    popular: true,
  },
];

const categories = ["Semua", "Elegant", "Rustic", "Modern", "Classic", "Tropical", "Floral"];

export function Templates() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredTemplates =
    activeCategory === "Semua"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <section id="templates" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
            Template Pilihan
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Desain yang Menginspirasi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih dari koleksi template premium kami yang dirancang oleh desainer profesional.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-lg overflow-hidden border border-border bg-card"
            >
              <div className="aspect-[3/4] relative bg-secondary">
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k="
                />
                {template.popular && (
                  <Badge className="absolute top-3 left-3">Populer</Badge>
                )}
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            Lihat Semua Template
          </Button>
        </div>
      </div>
    </section>
  );
}
