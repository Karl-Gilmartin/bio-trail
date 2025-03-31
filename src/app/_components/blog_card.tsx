import React from "react";
import Link from "next/link";
import { getImageUrl } from "../utils/getImage"; // ✅ Import helper

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  imageName: string;
  createdAt: Date;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const imageUrl = getImageUrl(post.imageName); // ✅ Get full Supabase image URL

  return (
    <Link href={`/blog/${post.id}`} className="block w-full">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full md:w-1/3 h-48 object-cover"
        />
        <div className="p-6 flex flex-col justify-between w-full">
          <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(post.createdAt).toDateString()}
          </p>
          <p className="text-gray-700 mt-4">{post.summary}</p>
          <span className="text-blue-500 mt-4 font-medium">Read more →</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
