import { SignIn } from "@clerk/clerk-react";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Huggle Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
