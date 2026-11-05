import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/faq";

export default function FaqSection() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-8 divide-y rounded-xl border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}<ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}