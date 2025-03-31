import { api } from "~/trpc/server";
import NavBar from "../_components/navbar";
import Footer from "../_components/footer";
import DottedBackground from "../_components/dotted_background";
import BlogCard from "../_components/blog_card";

export default async function BlogPage() {
  const posts = await api.blogs.getAll();

  return (
    <div className="flex flex-col min-h-screen relative">
      <DottedBackground />
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories about nature trails, wildlife sightings, and conservation efforts
            from our community.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="transform hover:scale-105 transition-transform duration-200">
                <BlogCard post={post} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">No blog posts found.</p>
              <p className="text-gray-400 mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}