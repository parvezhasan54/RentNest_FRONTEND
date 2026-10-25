import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/shared/PageHero";
import { posts } from "@/lib/blog";

export const metadata = { title: "Blog | RentNest" };

export default function BlogPage() {
  return (
    <>
      <PageHero title="The RentNest blog" description="Practical advice for renters and landlords." />
      <div className="container mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="flex h-full flex-col overflow-hidden">
            <div className="relative h-52 w-full">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <p className="text-xs font-medium text-primary">{post.category} · {post.readMinutes} min read</p>
              <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
              <p className="line-clamp-2">{post.excerpt}</p>
              <Button asChild variant="outline" className="mt-auto w-full">
                <Link href={`/blog/${post.slug}`}>Read article</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}