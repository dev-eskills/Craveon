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
          This Policy governs the cancellation of orders and the processing of refunds for food and beverage orders
          placed through the Craveon mobile application and website (collectively, the "Platform"). This Policy is a
          part of and subject to Craveon's Terms of Use.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Customer Order Cancellation Policy</h2>

        <h3 className="font-semibold mt-4 mb-1">1.1. Cancellation Window (Free Cancellation)</h3>
        <p className="mb-3">
          A customer may cancel an order and receive a full refund without any penalty if the cancellation is initiated
          within sixty (60) seconds of placing the order on the Platform. This is based on the principle of providing a
          minimum cooling-off period before the restaurant partner or delivery partner begins processing the order.
        </p>

        <h3 className="font-semibold mt-4 mb-1">1.2. Cancellation After Free Window (Cancellation Fee)</h3>
        <p className="mb-3">
          If a customer attempts to cancel an order after the sixty (60) seconds window has expired, the cancellation may
          be subject to a cancellation fee, as the order process (such as the restaurant starting preparation or the
          delivery partner being assigned and commencing travel) has likely begun.
        </p>

        <p className="mb-3">
          <strong>Order in Preparation (Restaurant Partner):</strong> If the cancellation is requested after the free
          window but before the delivery partner has picked up the order, Craveon reserves the right to charge a
          cancellation fee of up to 100% of the order value. This fee compensates the Restaurant Partner for the food
          already prepared and Craveon for the costs incurred. The exact fee will be clearly displayed to the customer on
          the app at the time of cancellation confirmation.
        </p>

        <p className="mb-3">
          <strong>Order Out for Delivery (Delivery Partner):</strong> Once the order status is marked as "Out for Delivery"
          by the Delivery Partner, the order cannot be cancelled by the customer. Any refusal to accept the order at the
          delivery location will be treated as a confirmed delivery and no refund will be issued. The customer shall be
          liable to pay the entire order amount.
        </p>

        <h3 className="font-semibold mt-4 mb-1">1.3. Pre-Orders</h3>
        <p className="mb-3">
          For orders placed for a future time slot ("Pre-Orders"), free cancellation is permitted up to sixty (60) minutes
          before the scheduled delivery time. Cancellation after this period will be subject to the cancellation fee as per
          Clause 1.2.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Craveon/Restaurant/Delivery Partner Order Cancellation Policy
        </h2>
        <p className="mb-3">
          Craveon or the Restaurant Partner reserves the right to cancel an order under the following circumstances, in
          which case the customer will be entitled to a full refund of the entire order value:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Non-Availability:</strong> If the item(s) ordered are unavailable with the Restaurant Partner.</li>
          <li><strong>Delivery Zone Restriction:</strong> If the customer’s delivery location falls outside the designated delivery area of the Restaurant Partner or Craveon.</li>
          <li><strong>Delivery Failure:</strong> If Craveon or the Delivery Partner fails to deliver the order due to reasons solely attributable to them (e.g., severe weather conditions, unforeseen logistics issues, or accident/breakdown of the delivery vehicle).</li>
          <li><strong>Restaurant Cancellation:</strong> If the Restaurant Partner unilaterally cancels the order due to unforeseen circumstances or inability to fulfil the order.</li>
        </ul>

        <p className="mb-3">
          <strong>2.1. Compliance with E-Commerce Rules, 2020</strong>
        </p>
        <p className="mb-4">
          In compliance with Rule 5(8) of the Consumer Protection (E-Commerce) Rules, 2020, Craveon shall not impose
          cancellation charges on consumers who cancel after confirming a purchase unless similar charges are also borne by
          Craveon or the Restaurant Partner if they cancel the purchase order unilaterally for any reason. Since Craveon
          and its partners do not bear a fee for cancelling an unfulfilled order (as per Section 2), a customer cancellation
          fee is justified to cover sunk costs.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Refund Policy</h2>

        <h3 className="font-semibold mt-4 mb-1">3.1. Refund Entitlement</h3>
        <p className="mb-3">
          A customer is entitled to a full or partial refund for prepaid orders only under the following conditions (in line
          with the rights against "Deficiency in Service" and "Defect in Goods" under the Consumer Protection Act, 2019):
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Order Cancellation by Craveon/Restaurant:</strong> 100% refund (as per Section 2).</li>
          <li><strong>Customer Cancellation (within Free Window):</strong> 100% refund (as per Section 1.1).</li>
          <li><strong>Defective or Damaged Product:</strong> If the packaging is tampered with, the food is spoiled, or the wrong order is delivered, and the customer refuses to accept the order at the time of delivery, a 100% refund is applicable. If accepted, any refund claim must be accompanied by photographic/video proof and will be subject to Craveon's investigation and discretion.</li>
          <li><strong>Missing Items/Portions:</strong> A proportional refund may be issued for the value of the specific item(s) or portion(s) missing from the order, provided the issue is reported immediately upon delivery.</li>
          <li><strong>Excess Amount Charged:</strong> If a customer is erroneously charged an amount greater than the order value, the excess amount will be refunded.</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-1">3.2. Refund Process and Timelines</h3>
        <p className="mb-3"><strong>Initiation:</strong> Approved refunds will be processed immediately upon acceptance of the cancellation or claim.</p>
        <p className="mb-3"><strong>Credit to Source:</strong> All refunds for prepaid orders will be credited back to the original source of payment (e.g., Credit Card, Debit Card, Net Banking, Wallet).</p>

        <p className="mb-3"><strong>Timeline (E-Commerce Rules Compliance):</strong> In adherence to Rule 5(10) of the Consumer Protection (E-Commerce) Rules, 2020, Craveon will effect all payments towards accepted refund requests within a reasonable period of time. The standard timelines are:</p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>UPI/Wallets:</strong> 2 to 4 business days.</li>
          <li><strong>Credit/Debit Cards/Net Banking:</strong> 5 to 7 business days.</li>
        </ul>
        <p className="mb-4">Note: Final crediting is subject to the processing timelines of the customer's bank/payment gateway.</p>

        <h3 className="font-semibold mt-4 mb-1">3.3. No Refund Scenarios</h3>
        <p className="mb-3">No refund will be provided in the following circumstances:</p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Customer cancellation after the order has been marked "Out for Delivery" or once the order is delivered.</li>
          <li>Order rejection at the doorstep due to customer-attributable reasons (e.g., change of mind, inability to pay Cash on Delivery).</li>
          <li>Failure to deliver due to the customer providing an incomplete, incorrect, or unreachable delivery address/contact number.</li>
          <li>Failure to accept delivery due to the customer's unavailability at the delivery location at the time of arrival.</li>
          <li>Claims of food quality or quantity that are subjective and not supported by verifiable evidence (like tampering or wrong item) reported immediately.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Grievance Redressal Mechanism (Consumer Protection Act, 2019)</h2>

        <p className="mb-3">
          As an E-Commerce Entity, Craveon maintains a robust grievance redressal system as mandated by the Consumer
          Protection Act, 2019.
        </p>

        <p className="mb-3"><strong>Grievance Officer:</strong></p>

        <p className="mb-3"><strong>Contact Details:</strong></p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Email: <a href="mailto:support@craveon.net" className="text-blue-600 underline">
            support@craveon.net
          </a></li>
          <li>
            Address: TECHVERTICO Consulting LLP, Wework Nesco IT park, 10th Floor, Building 4, Western Express Highway,
            Goregaon East, Mumbai-400063, Maharashtra, India.
          </li>
        </ul>

        <p className="mb-3">
          <strong>Procedure:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-4">
          <li>All customer complaints/grievances must be submitted via the designated channel on the Platform or via the official email.</li>
          <li>The Grievance Officer will acknowledge receipt of any consumer complaint within forty-eight (48) hours.</li>
          <li>The complaint will be redressed (resolved) within one (1) month from the date of receipt, as mandated by the Consumer Protection (E-Commerce) Rules, 2020.</li>
        </ol>
      </div>
      <Footer />
    </>
  );


}
