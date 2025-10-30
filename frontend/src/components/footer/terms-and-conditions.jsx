import React from 'react';
import Footer from './Footer';
import Nav from '../navbar/Nav';

export default function TermsAndConditions() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <p className="mb-4 font-semibold">
          Terms and Conditions for Use of Platform and Services (Registered Brand of TECHVERTICO Consulting LLP)
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction and Acceptance of Terms</h2>
        <p className="mb-4">
          <span className='font-bold'>1.1. Company Details: </span>The Craveon food delivery application and website (collectively, the "Platform") is a brand owned and operated by  <span className='font-bold'>TECHVERTICO Consulting LLP</span>, a Limited Liability Partnership registered in India, with its registered office at Wework Nesco IT park, 10th Floor, Building 4, Western Express Highway, Goregaon East, Mumbai - 400063, Maharashtra, India ("Craveon," "We," "Us," or "Our").
        </p>
        <p className="mb-4">
          <span className='font-bold'>1.2. Scope: </span>These Terms and Conditions ("Terms") govern your use of the Platform and the intermediary services provided by Craveon, which facilitate transactions between you (the "User" or "You") and independent third-party entities, including restaurants/eateries ("Restaurant Partners") and independent logistics providers/delivery partners ("Delivery Partners").
        </p>
        <p className="mb-4">
          <span className='font-bold'>1.3. Acceptance:</span> By accessing, browsing, or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, the Privacy Policy, the Cancellation and Refund Policy, and any other policies published on the Platform, as amended from time to time.
        </p>
        <p className='font-bold'> IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT USE THE PLATFORM.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Nature of Craveon's Services and Limitation of Liability (Intermediary Role)</h2>

        <p className='font-bold'>This section is crucial for limiting Craveon's liability under Indian law by clearly establishing its role as an intermediary/aggregator.</p>
        <br />
        <p className="mb-4">
          <span className='font-bold'>2.1. Intermediary Status:</span> Craveon operates solely as an <span className='font-bold'>'intermediary' </span>as defined under the Information Technology Act, 2000 and the Consumer Protection (E-commerce) Rules, 2020. Our role is strictly limited to: a. Providing a digital platform that connects Users with Restaurant Partners for the purchase of food and beverages. b. Facilitating, but not providing, independent delivery services through third-party Delivery Partners.
        </p>

        <p className="mb-4">
          <span className='font-bold'>2.2. Disclaimer of Liability for Food and Delivery: </span>
          <ul>
            <br />

            <li><span className='font-bold'>a. Food Quality & Safety:</span> Craveon does not prepare, manufacture, or package the food items. The <span className='font-bold'>Restaurant Partner</span> is solely and entirely responsible for the food quality, hygiene, safety, adherence to FSSAI standards, ingredients, menu pricing, compliance with food safety laws, and any allergies or health issues arising from the consumption of the food.</li>

            <li><span className='font-bold'>b. Delivery Service: </span> Craveon is not a transportation provider. The delivery is carried out by independent Delivery Partners. Craveon shall not be liable for any delays, errors, damages, or misconduct caused by the Delivery Partner.
            </li>

            <li><span className='font-bold'>c. Consumer Claims: </span> In the event of a consumer complaint regarding food quality, deficiency in goods, misleading representation, or product liability, liability shall primarily rest with the <span className='font-bold'>Restaurant Partner/Seller</span>, who is the 'Seller' and 'Manufacturer/Assembler/Producer' of the food under the Consumer Protection Act, 2019. Craveon's liability is limited to its obligations as a platform (e.g., displaying correct Restaurant Partner details, processing transactions).
            </li>
          </ul>
        </p>
        <p className="mb-4">
          <span className='font-bold'>2.3. No Agency:</span> The relationship between Craveon and the Restaurant Partners, and Craveon and the Delivery Partners, is on a principal-to-principal basis. Nothing in these Terms creates an agency, partnership, joint venture, or employer-employee relationship.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. User Obligations and Indemnity</h2>
        <p className="mb-4">
          <span className='font-bold'>3.1. Eligibility:</span> You must be 18 years of age or older and competent to contract under the Indian Contract Act, 1872, to use the Platform.
        </p>
        <p className="mb-4">
          <span className='font-bold'>3.2. Lawful Use:</span> You agree to comply with all applicable Indian laws, including but not limited to the Information Technology Act, 2000, the Consumer Protection Act, 2019, and the FSSA, 2006.
        </p>
        <p className="mb-4">
          <span className='font-bold'>3.3. Accurate Information: </span>You shall provide true, accurate, current, and complete information during registration and while placing an order.
        </p>
        <p className="mb-4">
          <span className='font-bold'>3.4. Indemnity:</span> You agree to indemnify, defend, and hold harmless Craveon, TECHVERTICO Consulting LLP, its affiliates, directors, agents, and employees from and against any and all losses, liabilities, claims, damages, demands, costs, and expenses (including legal fees and disbursements in connection therewith) asserted against or incurred by Craveon that arise out of, or result from: a. Your breach of these Terms. b. Your violation of any applicable laws, rules, or regulations in India. c. Any claim by a third party arising out of your use of the Platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Order Process, Cancellation, and Refunds</h2>
        <p className="mb-4">
          <span className='font-bold'>4.1. Contract of Sale:</span> The contract for the sale of food and beverages is strictly between the User and the Restaurant Partner. Craveon is merely an order-processing intermediary.
        </p>
        <p className="mb-4">
          <span className='font-bold'>4.2. Order Confirmation:</span> Upon placing an order, Craveon will confirm the order on behalf of the Restaurant Partner. The order acceptance is conditional upon availability and acceptance by the Restaurant Partner.
        </p>
        <p className="mb-4">
          <span className='font-bold'>4.3. Cancellation Policy:</span> Craveon reserves the right to define and amend a strict <span className='font-bold'>Cancellation and Refund Policy</span> which shall be deemed part of these Terms. Generally:
          <ul>
            <br />
            <li><span className='font-bold'>a. User Cancellation:</span> Users may cancel an order only within a short stipulated time window after placing it, often before the Restaurant Partner starts preparing the food. Post this window, cancellation may incur the full order value.</li>

            <li><span className='font-bold'>b. Restaurant/Craveon Cancellation:</span> Craveon or the Restaurant Partner may cancel an order due to unavailability, delivery location limitations, Force Majeure events, or non-compliance with these Terms.
            </li>
          </ul>
        </p>
        <p className="mb-4">
          <span className='font-bold'>4.4. Refunds:</span> Any refunds will be processed according to the published Cancellation and Refund Policy. Craveon's role is limited to facilitating the refund process on behalf of the Restaurant Partner.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Prices, Payment, and GST Compliance</h2>
        <p className="mb-4">
          <span className='font-bold'>5.1. Pricing:</span> All prices listed are provided by the Restaurant Partners and are inclusive of GST, unless otherwise stated. Craveon may apply a platform service fee and/or a delivery fee, which will be clearly displayed before you place the order.
        </p>
        <p className="mb-4">
          <span className='font-bold'>5.2. GST and Tax Compliance:</span> The <span className='font-bold'>Restaurant Partner</span> is responsible for all statutory taxes, including GST, on the sale of the food/beverages. The invoice/bill for the food items will be issued by the Restaurant Partner. Craveon will display its GSTIN and the Restaurant Partner's details as required by FSSAI E-commerce Guidelines and Indian tax laws.
        </p>
        <p className="mb-4">
          <span className='font-bold'>5.3. Payment Security:</span> Craveon uses third-party payment gateways for all online transactions. Craveon disclaims all liability for any loss or damage arising directly or indirectly to You due to the decline of authorisation for any transaction on account of You exceeding the preset limit mutually agreed with your bank.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Governing Law and Dispute Resolution (Jurisdiction)</h2>
        <p className="font-bold">
          This is a key clause for legal protection, confining disputes to a specific jurisdiction.
        </p>
        <br />
        <p className="mb-4">
          <span className='font-bold'>6.1. Governing Law:</span> These Terms shall be governed by and construed in accordance with the laws of India.
        </p>
        <p className="mb-4">
          <span className='font-bold'>6.2. Jurisdiction:</span> All disputes, differences, claims, and proceedings arising out of or relating to these Terms and the use of the Platform shall be subject to the exclusive jurisdiction of the competent courts in <span className='font-bold'>Mumbai, Maharashtra, India.</span>
        </p>
        <p className="mb-4">
          <span className='font-bold'>6.3. Consumer Dispute Redressal:</span> Notwithstanding the above, You have the right to approach the appropriate Consumer Dispute Redressal Commission (District, State, or National) as per the Consumer Protection Act, 2019, for a consumer complaint.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Intellectual Property Rights (IPR)</h2>
        <p className="mb-4">
          <span className='font-bold'>7.1. Ownership:</span> Craveon (TECHVERTICO Consulting LLP) is the sole and exclusive owner of all rights, title, and interest in and to the Platform, including all software, technology, content, trademarks, logos, and the brand name "Craveon."
        </p>
        <p className="mb-4">
          <span className='font-bold'>7.2. User Content:</span> By submitting content (e.g., reviews, ratings), you grant Craveon a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, and publish such content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Amendments and Severability</h2>

        <p className="mb-4">
          <span className='font-bold'>8.1. Amendments:</span> Craveon reserves the right to modify these Terms at any time without prior notification. The updated Terms will be effective upon posting on the Platform. Your continued use of the Platform constitutes your acceptance of the revised Terms.
        </p>
        <p className="mb-4">
          <span className='font-bold'>8.2. Severability:</span> If any provision of these Terms is deemed invalid or unenforceable under Indian law, the remaining provisions shall continue in full force and effect.
        </p>
       
      </div>
      <Footer />
    </>
  );
}
