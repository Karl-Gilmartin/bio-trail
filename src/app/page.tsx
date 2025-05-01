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
      <main className="flex-1 flex items-center p-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Welcome Message */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Discover Nature's Hidden Paths 🌳
              </h1>
              <p className="text-xl text-gray-600">
                Welcome to BioTrail 👋, your guide to exploring university nature trails 
                and discovering local wildlife. Start your adventure today!
              </p>
              {/* <p className="text-gray-600 italic">
                Created by <span className="font-medium">Karl</span>
              </p> */}
            </div>

            {/* Right Column - Image and CTA */}
            <div className="space-y-6 flex flex-col items-center h-[400px] md:h-[500px]">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/glucks.png"
                  alt="Nature Trail"
                  className="object-contain md:object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <Link 
                href="/explore" 
                className="bg-cambridgeBlue hover:bg-darkSlateGray text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg shadow-md"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
