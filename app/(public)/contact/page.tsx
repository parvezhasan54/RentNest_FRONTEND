import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/shared/PageHero";
import { SITE } from "@/lib/site";
import ContactForm from "./_component/ContactForm";

export const metadata = { title: "Contact | RentNest" };

export default function ContactPage() {
  const info = [
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/[^+\d]/g, "")}` },
    { icon: MapPin, label: "Office", value: SITE.address },
  ];

  return (
    <>
      <PageHero title="Contact us" description="Questions about a listing, a payment or your account? Send us a message and we'll reply by email." />
      <div className="container mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {info.map(({ icon: Icon, label, value, href }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm">{label}</p>
                  {href ? <a href={href} className="font-medium hover:text-primary">{value}</a> : <p className="font-medium">{value}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 lg:p-8"><ContactForm /></CardContent>
        </Card>
      </div>
    </>
  );
}