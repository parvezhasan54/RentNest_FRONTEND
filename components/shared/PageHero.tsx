export default function PageHero({ title, description }: { title: string; description: string }) {
  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg">{description}</p>
      </div>
    </section>
  );
}