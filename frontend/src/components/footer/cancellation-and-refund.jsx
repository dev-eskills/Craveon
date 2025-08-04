import React from 'react';
import Footer from './Footer';
import Nav from '../navbar/Nav';

export default function CancellationAndRefund() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>

        <p className="mb-4">
          We understand that plans change. This policy outlines how cancellations and refunds are
          handled when you order through our Food Delivery App.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Order Cancellation</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>
            You can cancel your order within <strong>2 minutes</strong> of placing it without any
            charge.
          </li>
          <li>
            After 2 minutes, cancellation may not be possible as the order may already be in
            preparation.
          </li>
          <li>
            If the restaurant or delivery partner cancels your order, you will receive a full
            refund.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Refund Process</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>
            Eligible refunds will be processed to your original payment method within{' '}
            <strong>5-7 business days</strong>.
          </li>
          <li>
            If you paid via wallet or promo code, the refund will be credited back to the same
            wallet/account.
          </li>
          <li>
            In case of payment failure but amount deduction, the refund will be initiated
            automatically by our payment provider.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Contact Support</h2>
        <p className="mb-4">
          For any queries related to cancellations or refunds, please reach out to our support team
          at <strong>support@foodapp.com</strong> or call us at <strong>+91 98765 43210</strong>.
        </p>
      </div>
      <Footer />
    </>
  );
}
