import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <p className="uppercase tracking-[0.3em] text-4xl text-gray-300 bg-black text-center py-5">
                Smart Roommate & Property Platform
      </p>
      <hr className="text-white"/>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="max-w-7xl mx-auto px-6 py-2 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
  

              <h1 className="text-6xl font-black leading-tight mb-6">
                Find The Perfect
                <span className="block text-gray-300">
                  Room & Roommate
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl">
                HomeTown Hub helps tenants discover compatible roommates,
                secure verified rooms, and chat instantly with owners — all
                in one modern platform.
              </p>

              <div className="flex flex-wrap gap-4">

                <Link
                    to="/properties"
                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl"
                    >

                    Explore Properties

                </Link>

                <Link
                    to="/register"
                    className="border border-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-black transition-all"
                    >

                    Become A Host

                </Link>

              </div>

              <div className="grid grid-cols-3 gap-6 mt-16">

                <div>
                  <h2 className="text-4xl font-black">10K+</h2>
                  <p className="text-gray-400 mt-2">Rooms Listed</p>
                </div>

                <div>
                  <h2 className="text-4xl font-black">5K+</h2>
                  <p className="text-gray-400 mt-2">Happy Tenants</p>
                </div>

                <div>
                  <h2 className="text-4xl font-black">98%</h2>
                  <p className="text-gray-400 mt-2">Compatibility Match</p>
                </div>

              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative">

              <div className="bg-white text-black rounded-4xl p-8 shadow-2xl">

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Featured Property
                    </p>

                    <h2 className="text-3xl font-black mt-1">
                      Urban Nest Residency
                    </h2>
                  </div>

                  <div className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
                    Verified
                  </div>
                </div>

                <div className="rounded-3xl overflow-hidden mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
                    alt="Property"
                    className="w-full h-72 object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">

                  <div className="bg-gray-100 p-4 rounded-2xl text-center">
                    <h3 className="text-2xl font-black">₹8K</h3>
                    <p className="text-sm text-gray-500">Starting Rent</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-2xl text-center">
                    <h3 className="text-2xl font-black">4.9</h3>
                    <p className="text-sm text-gray-500">Rating</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-2xl text-center">
                    <h3 className="text-2xl font-black">92%</h3>
                    <p className="text-sm text-gray-500">Match Score</p>
                  </div>

                </div>

                <Link
                    to="/properties"
                    className="block text-center w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all"
                    >

                    View Property

                </Link>
            </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center mb-16">
          <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
            Why Choose Us
          </p>

          <h2 className="text-5xl font-black mb-6">
            Everything You Need
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover a smarter way to rent rooms, find roommates, and manage
            bookings effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all border border-gray-100">
            <div className="text-5xl mb-5">🏠</div>
            <h3 className="text-2xl font-black mb-4">
              Verified Properties
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Browse trusted rooms and apartments with complete details and
              verified owners.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all border border-gray-100">
            <div className="text-5xl mb-5">🤝</div>
            <h3 className="text-2xl font-black mb-4">
              Compatibility Match
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Match with roommates based on sleep habits, food preference,
              cleanliness, and lifestyle.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all border border-gray-100">
            <div className="text-5xl mb-5">💬</div>
            <h3 className="text-2xl font-black mb-4">
              Real-Time Chat
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Instantly connect with property owners and potential roommates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all border border-gray-100">
            <div className="text-5xl mb-5">⚡</div>
            <h3 className="text-2xl font-black mb-4">
              Fast Booking
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Book rooms online in seconds with a seamless and modern
              experience.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-black text-white py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.3em] text-gray-400 text-sm mb-4">
              Process
            </p>

            <h2 className="text-5xl font-black mb-6">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
              <div className="text-6xl font-black text-gray-500 mb-6">
                01
              </div>

              <h3 className="text-3xl font-black mb-4">
                Create Profile
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Add your preferences and lifestyle details to improve roommate
                compatibility.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
              <div className="text-6xl font-black text-gray-500 mb-6">
                02
              </div>

              <h3 className="text-3xl font-black mb-4">
                Explore Rooms
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Filter rooms by rent, gender, location, room type, and
                compatibility score.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
              <div className="text-6xl font-black text-gray-500 mb-6">
                03
              </div>

              <h3 className="text-3xl font-black mb-4">
                Book & Chat
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Send booking requests and communicate instantly with owners and
                roommates.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="bg-black text-white rounded-[3rem] p-16 text-center relative overflow-hidden">

            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />

            <div className="relative z-10">

              <h2 className="text-6xl font-black mb-6">
                Ready To Find
                <span className="block text-gray-400">
                  Your Next Home?
                </span>
              </h2>

              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
                Join thousands of tenants and owners using HomeTown Hub to make
                renting smarter and easier.
              </p>

              <div className="flex flex-wrap justify-center gap-5">

                <Link
                    to="/register"
                    className="bg-white text-black px-10 py-5 rounded-2xl font-black hover:scale-105 transition-all"
                    >

                    Get Started

                </Link>

                <Link
                    to="/properties"
                    className="border border-white px-10 py-5 rounded-2xl font-black hover:bg-white hover:text-black transition-all"
                    >

                    Explore Rooms

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}
