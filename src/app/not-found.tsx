export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Return to Home
      </a>
    </div>
  );
} 