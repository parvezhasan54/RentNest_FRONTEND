import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { posts } from "@/lib/blog";

export default function BlogSection() {
  return (
    <section className="border-t bg-muted/30 py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">From the RentNest blog</h2>
            <p className="mt-2">Practical advice for renters and landlords.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">All articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.slug} className="flex h-full flex-col overflow-hidden">
              <div className="relative h-48 w-full shrink-0">
                <Image src={post.image} alt={post.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium text-primary">{post.category} · {post.readMinutes} min read</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm">{post.excerpt}</p>
                <Button asChild className="mt-auto w-full" variant="secondary">
                  <Link href={`/blog/${post.slug}`}>Read article</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}