import React from 'react';
import Footer from './Footer';
import Nav from '../navbar/Nav';

export default function TermsAndConditions() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <p className="mb-4">
          These Terms and Conditions govern your use of our Food Delivery App. By using our
          services, you agree to be bound by these terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
        <p className="mb-4">
          You agree to use our app for lawful purposes only. You must be at least 18 years old to
          place an order or create an account.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Account Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your login credentials and for
          all activities under your account.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Orders and Payments</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>All orders are subject to availability and restaurant acceptance.</li>
          <li>Prices include applicable taxes unless stated otherwise.</li>
          <li>Payments must be made through authorized methods only.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Cancellations and Refunds</h2>
        <p className="mb-4">
          You can cancel orders within a limited time. Refunds are subject to our refund policy and
          may take several business days to process.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. User Conduct</h2>
        <p className="mb-4">
          You agree not to misuse the app, abuse delivery personnel, or engage in fraudulent
          activity.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms at any time. Continued use of the app after changes constitutes
          your acceptance.
        </p>

        <p className="text-sm text-gray-500 mt-6">Last updated: April 23, 2025</p>
      </div>
      <Footer />
    </>
  );
}
