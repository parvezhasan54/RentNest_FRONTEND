import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { posts } from "@/lib/blog";

export default function BlogHighlights() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between"><h2 className="text-3xl font-bold">From the blog</h2>
          <Link href="/blog" className="text-sm text-primary hover:underline">All articles</Link></div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <Card className="h-full overflow-hidden transition hover:shadow-lg">
                <div className="relative h-44"><Image src={p.image} alt={p.title} fill className="object-cover" /></div>
                <CardContent className="space-y-2">
                  <p className="text-xs font-medium text-primary">{p.category} · {p.readMinutes} min read</p>
                  <h3 className="font-semibold leading-snug">{p.title}</h3>
                  <p className="line-clamp-2 text-sm">{p.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}