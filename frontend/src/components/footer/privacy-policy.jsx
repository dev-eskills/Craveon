import Nav from '../navbar/Nav';
import Footer from './Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          Welcome to our Food Delivery App. Your privacy is important to us, and this policy
          explains how we collect, use, and protect your personal information when you use our app
          or website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Personal Information:</strong> Name, email, phone number, address, and payment
            details.
          </li>
          <li>
            <strong>Location Data:</strong> To deliver your food to the correct address.
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, items ordered, and preferences to improve
            our services.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To process and deliver your orders efficiently.</li>
          <li>To send you order updates and promotional offers.</li>
          <li>To improve the user experience and app performance.</li>
          <li>To prevent fraud and ensure app security.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
        <p className="mb-2">We may share your information with:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Delivery partners to complete your orders.</li>
          <li>Payment processors to handle transactions.</li>
          <li>Government or legal authorities when required by law.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or delete your data. You can also opt out of
          promotional communications at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
        <p className="mb-4">
          We use secure technologies and follow industry best practices to protect your personal
          information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this policy occasionally. We encourage you to review it regularly to stay
          informed.
        </p>

        <p className="text-sm text-gray-600 mt-6">
          If you have questions or concerns about our Privacy Policy, please contact us at
          support@foodapp.com.
        </p>
      </div>
      <Footer />
    </>
  );
}
