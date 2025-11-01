import {
  Mail,
  Phone,
  Clock,
  Send,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import Nav from '../navbar/Nav';
import Footer from './Footer';

export default function ContactUs() {
  return (
    <>
      <Nav />

      {/* Full-screen gradient background */}
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <header className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl md:text-3xl font-bold text-gray-700 mb-4">
              Contact <span className="text-orange-600">CRAVEON</span>
            </h2>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Questions, feedback, or order help? We’re just a message away.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ---------- Contact Cards ---------- */}
            <aside className="space-y-6">

              {/* Email */}
              <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-orange-100 rounded-full mr-4 group-hover:bg-orange-200 transition">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Email</h3>
                </div>
                <a
                  href="mailto:support@craveon.net"
                  className="block text-orange-600 font-semibold hover:text-orange-700 text-lg"
                >
                  support@craveon.net
                </a>
                <p className="text-sm text-gray-500 mt-1">Reply within 1–2 hours</p>
              </div>

              {/* Phone */}
              <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-green-100 rounded-full mr-4 group-hover:bg-green-200 transition">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Call</h3>
                </div>
                <a
                  href="tel:+919892352028"
                  className="block text-2xl font-bold text-gray-900 hover:text-green-600"
                >
                  +91 98923 52028
                </a>
                {/* <p className="text-sm text-gray-500 mt-1">Mon–Sun 9:30 AM – 7:30 PM</p> */}
              </div>

              {/* Hours Card */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <Clock className="w-7 h-7 mr-3" />
                  <h3 className="text-lg font-bold">Support Hours</h3>
                </div>
                <p className="font-semibold">Open 7 Days a Week</p>
                <p className="text-orange-100">9:30 AM – 7:30 PM IST</p>
              </div>

              {/* Trust Badge */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center hover:bg-blue-100 transition">
                <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="font-bold text-blue-900">98% First-Contact Resolution</p>
                <p className="text-xs text-blue-700 mt-1">Your satisfaction, guaranteed</p>
              </div>
            </aside>

            {/* ---------- Contact Form ---------- */}
            <section className="lg:col-span-2">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Send className="w-7 h-7 mr-3 text-orange-600" />
                  Send a Message
                </h2>

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      required
                      defaultValue=""
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option>Order Issue</option>
                      <option>Delivery Problem</option>
                      <option>Payment & Refund</option>
                      <option>App/Website Issue</option>
                      <option>Restaurant Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Describe your issue or feedback…"
                      required
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Send className="w-6 h-6 mr-2" />
                    Send Message
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  <CheckCircle className="inline w-4 h-4 text-green-500 mr-1" />
                  We typically reply <strong>within 2 hours</strong> during support hours.
                </p>
              </div>
            </section>
          </div>

          {/* ---------- Quick Help CTA ---------- */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">Need instant answers?</p>
            <a
              href="/help"
              className="inline-flex items-center bg-orange-600 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-700 transition shadow-md hover:shadow-lg"
            >
              Visit Help Center
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
  