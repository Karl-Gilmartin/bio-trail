"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import NavBar from "../_components/navbar";
import { FaFileDownload } from "react-icons/fa";
import DottedBackground from "../_components/dotted_background";
import Footer from "../_components/footer";
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const createMessage = api.messages.create.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error(error.message || "Failed to send message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    createMessage.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DottedBackground />
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* About Me Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">About Me</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* image of Karl */}
                    <img src="/karl.jpeg" alt="Karl Gilmartin" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Karl Gilmartin</h3>
                    <p className="text-gray-600">Founder & Developer</p>
                  </div>
                </div>
                
                <div className="prose">
                  <p className="text-gray-700">
                    Hi, I'm Karl 👋. <br></br>
                    I'm a 3rd year Immersive Software Engineering [ISE] student at UL. I'm the founder of BioTrail, a website that allows you to record and view sightings of wildlife in your area and soon to be a mobile app.
                  </p>
                  
                  <p className="text-gray-700 mt-4">
                    BioTrail has been designed to enable other nature enthusiasts to contribute to the conservation of our wildlife. I am allow other to create custom routes and share them with others. To get started, pleease read this PDF guide and reach out to me.
                  </p>

                  {/* file icon to download the PDF guide */}
                  {/* <a 
                    href="/bioTrailGuide.pdf" 
                    download 
                    className="text-darkSlateGray hover:text-cambridgeBlue transition-colors flex items-center gap-2"
                  >
                    <FaFileDownload className="w-4 h-4" />
                    Download PDF Guide
                  </a> */}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Connect With Me</h4>
                  <div className="flex space-x-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                       className="text-gray-600 hover:text-cambridgeBlue transition-colors">
                      GitHub
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                       className="text-gray-600 hover:text-cambridgeBlue transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={createMessage.isPending}
                  className="w-full bg-cambridgeBlue text-white py-2 px-4 rounded-md hover:bg-darkSlateGray transition-colors duration-200 disabled:opacity-50"
                >
                  {createMessage.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}