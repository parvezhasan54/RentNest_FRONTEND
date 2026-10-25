import PageHero from "./PageHero";

export interface LegalSection { id?: string; heading: string; body: string[] }

export default function LegalPage({
  title, description, updated, sections,
}: { title: string; description: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero title={title} description={description} />
      <div className="container mx-auto max-w-3xl space-y-10 px-6 py-14">
        <p className="text-sm">Last updated: {updated}</p>
        {sections.map((s) => (
          <section key={s.heading} id={s.id} className="scroll-mt-24 space-y-3">
            <h2 className="text-2xl font-bold">{s.heading}</h2>
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
      </div>
    </>
  );
}