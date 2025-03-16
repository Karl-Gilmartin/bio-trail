import ComingSoon from "../_components/coming_soon";
import DottedBackground from "../_components/dotted_background";
import Footer from "../_components/footer";
import NavBar from "../_components/navbar";


export default async function AboutPage() {

  return (
    <div className="flex flex-col min-h-screen relative">
      <DottedBackground />
      <NavBar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <ComingSoon />
        
      </main>
      <Footer />
    </div>
  );
}