import Link from "next/link";

export default function NotFound() {
  return (
    <div className="f-col f-center mt-16 gap-2">
      <h1 className="fs-22 fw-600">404 - Not Found</h1>
      <p className="fs-15 fw-400 text-gray-11">The page you are looking for does not exist.</p>
      <div className="mt-4">
        <Link href="/" className="btn-outline btn rounded-md">
          Go Home
        </Link>
      </div>
    </div>
  );
}