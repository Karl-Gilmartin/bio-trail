import { notFound } from "next/navigation";
import NavBar from "../../_components/navbar";
import Footer from "../../_components/footer";
import DottedBackground from "../../_components/dotted_background";
import Link from "next/link";
import { api } from "~/trpc/server";
import { getImageUrl } from "../../utils/getImage";

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // Fetch blog post using tRPC router
  const post = await api.blogs.getById(Number(params.id));

  if (!post) return notFound(); // 404 if blog post doesn't exist

  const imageUrl = getImageUrl(post.imageName);

  return (
    <div className="flex flex-col min-h-screen relative">
      <DottedBackground />
      <NavBar />
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-64 object-cover rounded-lg shadow-md mb-6" 
          />
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 text-sm mb-6">
            Published on {new Date(post.createdAt).toDateString()}
          </p>
          <div className="prose max-w-none text-gray-800">
            {post.content}
          </div>
          <Link 
            href="/blog" 
            className="mt-6 inline-block text-blue-500 hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
