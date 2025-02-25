import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.2),_transparent)]"></div>

      <div className="relative max-w-4xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-14 text-center border border-gray-300">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight ">
          Welcome to <span className="text-indigo-600">Gluby</span>
        </h1>
        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
          The premier destination for secure and engaging online auctions.
        </p>

        <div className="bg-white/60 p-8 rounded-xl shadow-lg border border-gray-200 transition-transform hover:scale-[1.02]">
          <h2 className="text-3xl font-semibold text-gray-900 mb-5 ">
            Elevate Your Auction Experience
          </h2>
          <p className="text-gray-600 text-lg">
            At Gluby, we prioritize transparency, security, and a seamless user
            experience, connecting buyers and sellers effortlessly.
          </p>
        </div>

        <div className="mt-10 text-left">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
            Key Features:
          </h3>
          <ul className="list-none space-y-4 text-gray-700 text-lg">
            <li className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
              <span>Personalized Watchlist to track favorite auctions.</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
              <span>Secure real-time messaging for smooth interactions.</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
              <span>
                Verified sellers and authentic listings for confidence.
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
              <span>
                Dedicated buyer & seller dashboards for easy management.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-12 p-8 bg-white/60 rounded-xl border border-gray-300 shadow-md transition-transform hover:scale-[1.02]">
          <h3 className="text-2xl font-semibold text-gray-900 drop-shadow-md">
            Why Choose Gluby?
          </h3>
          <p className="text-gray-600 mt-3 text-lg">
            We redefine online auctions with a seamless and secure experience.
            Join us and step into the future of digital bidding.
          </p>
        </div>

        <div className="mt-12 flex justify-center space-x-6">
          <Link
            href="/login"
            className="px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-all hover:scale-[1.05]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-green-700 transition-all hover:scale-[1.05]"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
