import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, posts } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} | RentNest` : "Article not found | RentNest" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="container mx-auto max-w-3xl space-y-8 px-6 py-14">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
      <header className="space-y-3">
        <p className="text-sm font-medium text-primary">
          {post.category} · {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readMinutes} min read
        </p>
        <h1 className="text-4xl font-bold">{post.title}</h1>
      </header>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
      </div>
      <div className="space-y-5 text-lg leading-8">
        {post.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}