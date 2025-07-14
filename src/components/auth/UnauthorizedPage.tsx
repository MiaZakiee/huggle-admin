import { useAdminAuth } from "@/hooks/useAdminAuth";

export function UnauthorizedPage() {
  const { signOut, userEmail } = useAdminAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-700 mb-4">
            Your email{" "}
            <span className="font-mono bg-red-100 px-2 py-1 rounded">
              {userEmail}
            </span>{" "}
            is not authorized to access this admin portal.
          </p>
          <p className="text-sm text-red-600 mb-6">
            Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
