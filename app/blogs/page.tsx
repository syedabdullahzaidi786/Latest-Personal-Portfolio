import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs — Syed Abdullah Zaidi',
  description: 'Articles, writeups and thoughts on AI, fullstack development, and software engineering.',
};

const Navbar = dynamic(() => import('@/components/ui/Navbar').then((m) => ({ default: m.Navbar })));
const Footer = dynamic(() => import('@/components/ui/Footer').then((m) => ({ default: m.Footer })));
const BlogsClient = dynamic(() => import('@/components/blogs/BlogsClient').then((m) => ({ default: m.BlogsClient })));

export default function BlogsPage() {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10">
        <Navbar />
        <BlogsClient />
        <Footer />
      </div>
    </main>
  );
}
