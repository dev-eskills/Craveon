import React from 'react';
import Footer from './Footer';
import Nav from '../navbar/Nav';

export default function ContactUs() {
  return (
    <>
      <Nav />
      <div className="max-w-3xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <p className="mb-4">
          Have questions, feedback, or need help with your order? We're here to help!
        </p>

        <div className="space-y-2 mb-6">
          <p>
            <strong>Email:</strong> support@foodapp.com
          </p>
          <p>
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <p>
            <strong>Customer Support Hours:</strong> 9:00 AM – 11:00 PM (All Days)
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Send us a message</h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
