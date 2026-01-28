"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Send } from "lucide-react";

interface RsvpSectionProps {
  guestName?: string;
}

export function RsvpSection({ guestName }: RsvpSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: guestName || "",
    attendance: "attending",
    guests: "1",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("RSVP submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-20 px-6 bg-card">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Thank You!
          </h2>
          <p className="text-muted-foreground">
            Your response has been recorded. We look forward to celebrating with
            you!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Will You Join Us?
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            RSVP
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-3">
            <Label>Will you be attending?</Label>
            <RadioGroup
              value={formData.attendance}
              onValueChange={(value) =>
                setFormData({ ...formData, attendance: value })
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attending" id="attending" />
                <Label htmlFor="attending" className="font-normal cursor-pointer">
                  Joyfully Accept
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-attending" id="not-attending" />
                <Label htmlFor="not-attending" className="font-normal cursor-pointer">
                  Regretfully Decline
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.attendance === "attending" && (
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="5"
                value={formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: e.target.value })
                }
                className="bg-background"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message for the Couple (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Write your wishes for the happy couple..."
              rows={4}
              className="bg-background resize-none"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Send className="w-4 h-4 mr-2" />
            Send RSVP
          </Button>
        </form>
      </div>
    </section>
  );
}
