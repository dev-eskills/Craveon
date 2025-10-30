import Nav from '../navbar/Nav';
import Footer from './Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Nav />
      <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left">Privacy Policy</h1>

        <section className="mb-10">
          <p className="mb-4">
            This Privacy Policy applies to the mobile application <strong>"Craveon"</strong> and its associated services (collectively, the <strong>"Services"</strong>), owned and operated by <strong>TECHVERTICO Consulting LLP</strong>, a Limited Liability Partnership registered in India. We are committed to protecting the privacy of our users and ensuring the security of their personal data in compliance with Indian laws, including the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)</strong>, until the full implementation of the DPDP Act.
          </p>
        </section>

        {/* 1. Identity of the Data Fiduciary */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Identity of the Data Fiduciary</h2>
          <p className="mb-3">The Services are provided by:</p>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p><strong>TECHVERTICO Consulting LLP</strong></p>
            <p><strong>Registered Address:</strong> WeWork Nesco IT Park, 10th Floor, Building 4, Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063, India.</p>
            <p><strong>Email Address for Grievances and Data Protection Matters:</strong>{' '}
              <a href="mailto:support@craveon.net" className="text-blue-600 underline hover:text-blue-800">
                support@craveon.net
              </a>
            </p>
          </div>
          <p className="mt-4">
            In the context of Indian data protection laws, <strong>TECHVERTICO Consulting LLP</strong> acts as the <strong>'Data Fiduciary'</strong>, which means we determine the purpose and means of processing your personal data.
          </p>
        </section>

        {/* 2. Personal Data We Collect */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Personal Data We Collect</h2>
          <p className="mb-4">
            We limit the collection of personal data to what is necessary for the specified purposes of providing our food delivery services (<em>Principle of Data Minimization</em>). We collect the following categories of data, primarily in digital form:
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">A. Data You Provide Directly (During Account Creation and Ordering):</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li><strong>Identity Data:</strong> Name, email address, phone number.</li>
            <li><strong>Location/Delivery Data:</strong> Precise geographic location (if permissions are granted and necessary for delivery), complete delivery addresses (including PIN code, landmark), and instructions.</li>
            <li><strong>Account Credentials:</strong> Password and other information used to authenticate access to Craveon.</li>
            <li><strong>Financial and Transaction Data:</strong> Payment instrument details (like the last four digits of your card) are typically collected and processed directly by our third-party payment gateways; we only retain the necessary transaction records, order history, and payment status.</li>
            <li><strong>User Preferences:</strong> Dietary preferences, order history, and saved favorites.</li>
            <li><strong>Communication Data:</strong> Content of messages, emails, or calls with our customer support, including feedback, reviews, and ratings.</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">B. Data Collected Automatically (Through App Usage):</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li><strong>Technical Data:</strong> Internet Protocol (IP) address, operating system type, unique device identifiers, device model, browser type, and app version.</li>
            <li><strong>Usage Data:</strong> Details about how you use the Craveon application, including timestamps, features accessed, pages viewed, time spent on the app, and search queries.</li>
            <li><strong>Location Data (Approximate):</strong> General location information inferred from your IP address or network data to provide localized services, even if precise location access is not granted.</li>
          </ul>
        </section>

        {/* 3. Purpose of Processing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Purpose of Processing Personal Data and Lawful Basis</h2>
          <p className="mb-4">
            We process your personal data based on your consent and/or for legitimate uses as permitted by the DPDP Act and other applicable laws, for the following specified purposes:
          </p>

          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold">Purpose of Processing</th>
                  <th className="px-4 py-3 font-semibold">Lawful Basis (DPDP Act)</th>
                  <th className="px-4 py-3 font-semibold">Categories of Data Used</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">Service Provision & Contract Fulfillment: To enable you to register, log in, process, fulfil, deliver your food orders, and manage payments.</td>
                  <td className="px-4 py-3">Consent (Clear affirmative action when signing up and placing an order) and Legitimate Use (For the performance of a contract or in connection with a service you have requested).</td>
                  <td className="px-4 py-3">Identity Data, Location/Delivery Data, Financial and Transaction Data, Account Credentials.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3">Communication: To send order updates, confirmations, administrative information (like changes to terms), security alerts, and to respond to your customer support inquiries.</td>
                  <td className="px-4 py-3">Consent and Legitimate Use (Responding to a request initiated by the Data Principal).</td>
                  <td className="px-4 py-3">Identity Data, Communication Data.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Personalization and Improvement: To analyze usage trends, understand preferences, and personalize the app experience, content, and offers, thereby improving our Services.</td>
                  <td className="px-4 py-3">Consent (Opt-in for personalized experience/marketing) and Legitimate Use (For the effective functioning of the Service).</td>
                  <td className="px-4 py-3">Usage Data, User Preferences, Location Data.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3">Marketing and Promotions: To send you promotional communications, special offers, and information about restaurants or products we think you might be interested in.</td>
                  <td className="px-4 py-3">Consent (Separate, informed consent with an easy option to opt-out).</td>
                  <td className="px-4 py-3">Identity Data, User Preferences, Transaction Data.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Security, Fraud Prevention & Legal Compliance: To detect and prevent fraudulent activities, ensure the security of our platform, and comply with legal obligations, court orders, or requests from law enforcement/regulatory authorities.</td>
                  <td className="px-4 py-3">Legitimate Use (For compliance with law and for purposes of security).</td>
                  <td className="px-4 py-3">All categories, as necessary.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Consent */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Consent</h2>
          <p className="mb-4">
            In compliance with the DPDP Act, we will obtain your consent for processing your personal data, which shall be:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
            <li>Free, Specific, Informed, Unconditional, and Unambiguous.</li>
            <li>Obtained through a clear affirmative action.</li>
            <li>Limited to such personal data as is necessary for the specified purpose.</li>
          </ul>
          <p className="mb-4">
            When seeking your consent, we will provide you with a notice that clearly specifies the personal data requested, the purpose of processing, and how you can exercise your rights and file a complaint.
          </p>
          <p className="mb-4">
            You have the right to <strong>withdraw your consent at any time</strong> by contacting us through the Grievance Officer's email address or via the app settings. Upon withdrawal of consent, we will cease to process the associated personal data, unless retention is required for compliance with any other law.
          </p>
        </section>

        {/* 5. Disclosure and Sharing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Disclosure and Sharing of Personal Data</h2>
          <p className="mb-4">
            We only share your personal data with third parties necessary to provide the Services for the specified purposes, and such sharing is done under a contract that imposes security and confidentiality obligations on the recipient.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Restaurant Partners:</strong> We share necessary Identity and Location/Delivery Data with the restaurants to enable them to prepare and process your order.</li>
            <li><strong>Delivery Partners (Riders):</strong> We share your Name, Phone Number, and precise Location/Delivery Data with the delivery personnel to enable them to locate you and complete the delivery.</li>
            <li><strong>Payment Gateways:</strong> We share transaction details with secure, PCI-compliant third-party payment processors to facilitate online payments.</li>
            <li><strong>Service Providers:</strong> We engage third-party vendors for functions such as cloud hosting, data analytics, customer support, and marketing. These 'Data Processors' are bound by contracts to process data only on our behalf and as per our instructions.</li>
            <li><strong>Legal/Regulatory Requirements:</strong> We will disclose your data where required by law, court order, or governmental authority to comply with legal obligations.</li>
          </ul>
        </section>

        {/* 6. Data Security */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security and Accountability</h2>
          <p className="mb-4">
            We, as the Data Fiduciary, implement reasonable security practices and procedures (as defined under the SPDI Rules and mandated by the DPDP Act) to protect the personal data we process from unauthorised access, processing, disclosure, alteration, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
            <li><strong>Access Controls:</strong> Implementing restricted access to personal data on a need-to-know basis.</li>
            <li><strong>Regular Audits:</strong> Conducting periodic security reviews and audits.</li>
          </ul>
          <p className="mb-4">
            In the event of a Personal Data Breach, we will notify the <strong>Data Protection Board of India</strong> and the affected <strong>Data Principal (you)</strong> as required by the DPDP Act.
          </p>
        </section>

        {/* 7. Data Retention */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention and Erasure</h2>
          <p className="mb-4">
            We retain personal data only for as long as is necessary to fulfil the purposes for which it was collected or as required by law (<em>Principle of Storage Limitation</em>).
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
            <li>We will cease to retain your personal data as soon as it is reasonable to assume that the purpose for which it was collected is no longer being served.</li>
            <li>Upon the withdrawal of your consent or a request for erasure, we will delete your personal data, unless retention is necessary for complying with legal obligations (e.g., tax or financial records).</li>
          </ul>
        </section>

        {/* 8. Your Rights */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Your Rights as a Data Principal</h2>
          <p className="mb-4">As an individual whose personal data is being processed, you have the following rights under the DPDP Act:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Right to Information:</strong> The right to be informed about your personal data processing activities, which this Privacy Policy serves to fulfil.</li>
            <li><strong>Right to Access:</strong> The right to request confirmation of whether your data is being processed, and access to a summary of such processing activities.</li>
            <li><strong>Right to Correction and Erasure:</strong> The right to request the correction, completion, or updation of inaccurate or incomplete personal data, and the right to request the erasure of your personal data where retention is no longer necessary.</li>
            <li><strong>Right to Grievance Redressal:</strong> The right to have your grievances addressed by the Data Fiduciary's Grievance Officer.</li>
            <li><strong>Right to Nominate:</strong> The right to nominate another individual who shall, in the event of your death or incapacity, exercise your rights as a Data Principal.</li>
            <li><strong>Right to Withdraw Consent:</strong> The right to withdraw your consent at any time, with the procedure detailed in section 4.</li>
          </ul>
        </section>

        {/* 9. Grievance Redressal */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Grievance Redressal Mechanism</h2>
          <p className="mb-4">We have appointed a Grievance Officer to address any concerns you may have regarding the processing of your personal data.</p>
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <p><strong>Grievance Officer Contact Details:</strong></p>
            <p><strong>Email:</strong>{' '}
              <a href="mailto:support@craveon.net" className="text-blue-600 underline">
                support@craveon.net
              </a>
            </p>
            <p><strong>Subject Line:</strong> Privacy Grievance - Craveon</p>
          </div>
          <p className="mt-4 mb-4">
            We commit to acknowledging and responding to all Data Principal requests and grievances within a reasonable timeframe as prescribed by applicable law. If you are dissatisfied with our response, you may have the right to appeal to the <strong>Data Protection Board of India</strong>.
          </p>
        </section>

        {/* 10. Children's Data */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Protection of Children's Personal Data</h2>
          <p className="mb-4">
            The Services are intended for individuals who are <strong>18 years of age or older</strong>. 'Child' is defined under the DPDP Act as an individual below the age of 18 years.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>If we process the personal data of a Child, such processing will be done only after obtaining <strong>verifiable parental consent</strong>.</li>
            <li>We do not undertake any processing that is likely to cause detrimental effect to the well-being of a child.</li>
            <li>We do not track, perform behavioural monitoring of, or direct targeted advertising towards Children.</li>
          </ul>
        </section>

        {/* 11. Updates */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">11. Updates to the Privacy Policy</h2>
          <p className="mb-4">
            This Privacy Policy may be updated from time to time to reflect changes in our data processing practices or legal requirements, particularly upon the full notification and enforcement of the DPDP Act's provisions. We will notify you of any material changes by posting the new policy on the Craveon application and/or through other appropriate communication channels, such as email. <strong>Your continued use of the Services after the effective date of the revised policy constitutes your acceptance of the new terms.</strong>
          </p>
        </section>

        {/* Contact */}
        <p className="text-sm text-gray-600 mt-12 italic text-center md:text-left">
          If you have questions or concerns about our Privacy Policy, please contact us at{' '}
          <a href="mailto:support@craveon.net" className="text-blue-600 underline">
            support@craveon.net
          </a>
          .
        </p>
      </div>
      <Footer />
    </>
  );
}
