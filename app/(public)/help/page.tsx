import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";

export const metadata = { title: "Help Center | RentNest" };

const groups = [
  { title: "Renting", items: [
    { q: "How do I request a rental?", a: "Open any listing, click Rent Now, choose your move-in date and send a message to the landlord. You need to be logged in as a tenant." },
    { q: "What happens after I send a request?", a: "The landlord reviews it from their dashboard. You can follow its status under Rental Requests: Pending, Approved or Rejected." },
    { q: "When do I pay?", a: "Only after the landlord approves your request. An approved request shows a Pay button that takes you to Stripe Checkout for the first month's rent." },
    { q: "Can I save listings for later?", a: "Yes. Tap the heart on any listing. Your saved homes are available from the profile menu." },
  ]},
  { title: "Listing a property", items: [
    { q: "How do I list a property?", a: "Register as a landlord, open your dashboard and choose Add Property. Upload photos, set the price and amenities, then publish." },
    { q: "How do I approve or reject a request?", a: "Go to Rental Requests in your dashboard. Pending requests have Approve and Reject buttons. Once the tenant has paid, you can mark the rental completed." },
  ]},
  { title: "Account & payments", items: [
    { q: "Are my card details stored?", a: "No. Payments are handled by Stripe. RentNest never sees or stores your card number." },
    { q: "Who can leave a review?", a: "Tenants who have completed payment for a property can review it." },
    { q: "I have a problem with a payment.", a: "Contact us with the transaction ID shown in your payment history and we'll look into it." },
  ]},
];

export default function HelpPage() {
  return (
    <>
      <PageHero title="Help Center" description="Quick answers to common questions about renting and listing on RentNest." />
      <div className="container mx-auto max-w-3xl space-y-12 px-6 py-14">
        {groups.map((g) => (
          <section key={g.title} className="space-y-4">
            <h2 className="text-2xl font-bold">{g.title}</h2>
            <div className="divide-y rounded-xl border">
              {g.items.map((item) => (
                <details key={item.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 p-8 text-center">
          <h2 className="text-xl font-semibold">Still stuck?</h2>
          <Button asChild><Link href="/contact">Contact support</Link></Button>
        </div>
      </div>
    </>
  );
}