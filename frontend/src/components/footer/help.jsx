import { Mail, Phone, Clock, MapPin, Send, CheckCircle } from 'lucide-react';
import Nav from '../navbar/Nav';
import Footer from './Footer';

export default function ContactUs() {
    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">We’re Here to Help</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have a question, feedback, or need assistance with your order?
                            Reach out — our team is ready to make things right.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Email Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                        <Mail className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                                </div>
                                <a
                                    href="mailto:support@craveon.net"
                                    className="text-orange-600 hover:text-orange-700 font-medium block mb-1"
                                >
                                    support@craveon.net
                                </a>
                                <p className="text-sm text-gray-500">Expect a reply within 2 hours</p>
                            </div>

                            {/* Phone Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                                </div>
                                <a
                                    href="tel:+919892352028"
                                    className="text-lg font-semibold text-gray-900 hover:text-orange-600"
                                >
                                    +91 98923 52028
                                </a>
                                {/* <p className="text-sm text-gray-500 mt-1">Mon–Sun: 9:30 AM – 7:30 PM</p> */}
                            </div>

                            {/* Support Hours Card */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-2">
                                    <Clock className="w-6 h-6 mr-3" />
                                    <h3 className="font-bold">Live Support</h3>
                                </div>
                                <p className="text-orange-50">Available 7 days a week</p>
                                <p className="text-sm mt-1 font-medium">9:30 AM – 7:30 PM IST</p>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-blue-900">
                                    98% of issues resolved on first contact
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Send className="w-6 h-6 mr-2 text-orange-600" />
                                    Send Us a Message
                                </h2>

                                <form className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Your Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="Enter you email"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                            Subject
                                        </label>
                                        <select
                                            id="subject"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select an option</option>
                                            <option value="order">Order Issue</option>
                                            <option value="delivery">Delivery Problem</option>
                                            <option value="payment">Payment & Refund</option>
                                            <option value="app">App/Website Issue</option>
                                            <option value="restaurant">Restaurant Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            placeholder="Please describe your issue or feedback in detail..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </button>
                                </form>

                                <p className="mt-6 text-xs text-gray-500">
                                    We typically respond within <span className="font-medium">1–2 hours</span> during support hours.
                                </p>
                            </div>
                        </div>
                    </div>

                  
                </div>
            </div>
            <Footer />
        </>
    );
}