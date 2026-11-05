import { CreditCard, Search, Send, Star } from "lucide-react";

const steps = [
  { icon: Search, title: "Search", text: "Filter by city, type, price, bedrooms and rating." },
  { icon: Send, title: "Request", text: "Send a rental request with your move-in date." },
  { icon: CreditCard, title: "Pay securely", text: "Once approved, pay the first month via Stripe." },
  { icon: Star, title: "Review", text: "After your stay, rate the home for the next renter." },
];

export default function HowItWorks() {
  return (
    <section className="border-y bg-muted/30 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold">How RentNest works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}