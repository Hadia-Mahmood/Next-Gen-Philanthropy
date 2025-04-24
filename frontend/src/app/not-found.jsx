import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      <div className="px-40 py-20 bg-white rounded-md shadow-md">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-blue-600 text-9xl">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="mt-4 text-gray-500 font-poppins">
            {`Sorry, we couldn't find the page you're looking for.`}
          </p>
          <Link
            href="/"
            className=" font-poppins mt-6 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
