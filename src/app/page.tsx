import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/server";
import NavBar from "./_components/navbar";
import Footer from "./_components/footer";
import DottedBackground from "./_components/dotted_background";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <div className="flex flex-col min-h-screen relative">
      <DottedBackground /> {/* Ensure background covers everything */}
      <NavBar />
      <main className="flex-1 flex flex-col justify-center items-center p-4">
        {/* Your page content here */}
        <h1 className="text-3xl font-bold">Welcome and Hello 👋👋</h1>
        <p className="text-gray-600">This is a work in progress. <a className="font-extralight italic">Karl</a></p>
      </main>
      <Footer />
    </div>
  );
}
