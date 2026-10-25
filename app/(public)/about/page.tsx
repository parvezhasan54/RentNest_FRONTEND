import Link from "next/link";
import { BadgeCheck, Home, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/shared/PageHero";

export const metadata = { title: "About | RentNest" };

const values = [
  { icon: BadgeCheck, title: "Transparent listings", text: "Every listing shows its full price, address, photos and amenities up front, with no surprise fees at checkout." },
  { icon: Zap, title: "Fast answers", text: "Requests go straight to the landlord's dashboard, where they can be approved or rejected in one click." },
  { icon: ShieldCheck, title: "Secure payments", text: "First-month rent is paid through Stripe Checkout. Card details never touch our servers." },
];

const steps = {
  tenants: ["Browse and filter listings, and save the ones you like.", "Send a rental request with your move-in date and a short message.", "Once approved, pay securely and your rental becomes active.", "After your stay, leave a review to help the next renter."],
  landlords: ["Create a listing with photos, pricing and amenities.", "Review incoming requests from your dashboard.", "Approve the right tenant and receive payment through Stripe.", "Mark the rental completed when it ends."],
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Renting should feel simple"
        description="RentNest connects renters and landlords on one platform, from the first search to the final review."
      />

      <div className="container mx-auto max-w-7xl space-y-20 px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardContent className="space-y-3 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p>{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(["tenants", "landlords"] as const).map((who) => (
            <Card key={who}>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-2xl font-bold">{who === "tenants" ? "For tenants" : "For landlords"}</h2>
                <ol className="space-y-3">
                  {steps[who].map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                      <span className="text-muted-foreground">{s}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <Home className="h-10 w-10 text-primary" />
          <h2 className="text-3xl font-bold">Ready to find your next home?</h2>
          <div className="flex gap-3">
            <Button asChild size="lg"><Link href="/properties">Browse listings</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/auth/register">Create an account</Link></Button>
          </div>
        </div>
      </div>
    </>
  );
}