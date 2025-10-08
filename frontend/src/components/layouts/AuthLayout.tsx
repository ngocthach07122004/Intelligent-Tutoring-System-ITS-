export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-1 py-6 bg-[#1e1e2f] text-white">
    <div className="mx-auto w-full min-w-[360px] space-y-6 max-w-sm ">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-extrabold text-white">Login</h1>
      </div>
      <div className="w-full max-w-md rounded-xl border border-gray-300 shadow bg-white text-gray-900">
        {children}
      </div>
    </div>
  </div>
);
