import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Idea Collection System (SNPP Stack)
      </h1>
      <p className="text-gray-600 mb-8">
        Next.js Frontend initialized successfully! Ready to connect with Spring Boot.
      </p>
      
      {/* This link will result in a 404 error until Step 3 is completed */}
      <Link 
        href="/login" 
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}