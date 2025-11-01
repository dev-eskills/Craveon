import { Twitter, Facebook, Instagram, HousePlus, Phone, Mail, Clock } from 'lucide-react';
import AppStore from '/AppStore.png';
import WindowStore from '/WindowStore.png';
import GooglePlay from '/GooglePlay.png';
import ContentWrapper from '../ui/ContentWrapper';
import footerimg1 from '/footerimg1.webp';
import footerimg from '/footerimg.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="bg-zinc-900 text-white py-8 px-4 md:px-8 w-full mt-15 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://yummi-theme.myshopify.com/cdn/shop/files/footer_1.jpg?v=1623926986&width=1920')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <ContentWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <img
            src={footerimg}
            alt=""
            className="absolute md:flex hidden -bottom-30 -left-30 opacity-50"
          />

          <img src={footerimg1} alt="" className="absolute top-14 -right-30 " />

          {/* Help Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Search
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <Link
                  to="/help"
                  className="group relative inline-block hover:text-[#FF6900]"
                >
                  Help
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Information
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="group relative inline-block hover:text-[#FF6900]"
                >
                  Privacy Policy
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Shipping Details
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact-us" className="group relative inline-block hover:text-[#FF6900]">
                  Contact Us
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <a href="/about-us" className="group relative inline-block hover:text-[#FF6900]">
                  About Us
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="group relative inline-block hover:text-[#FF6900]"
                >
                  Terms & conditions
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation-and-refund"
                  className="group relative inline-block hover:text-[#FF6900]"
                >
                  Cancellation and Refund
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Deliveries
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Search Terms
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Advanced Search
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Help & FAQ's
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Store Location
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="group relative inline-block hover:text-[#FF6900]">
                  Order & Return
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">
                  <HousePlus />
                </span>
                <a
                  href="https://www.google.com/maps?q=WEWORK+NESCO+IT+PARK,+10t,+WESTERN+EXPRESS+HIGHWAY,+GOREGAON+(EAST),+Mumbai-400063,+Maharashtra,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="z-50 hover:text-orange-100"
                >
                  WEWORK NESCO IT PARK,
                  <br /> 10t, WESTERN EXPRESS
                  <br /> HIGHWAY, GOREGAON <br />
                  (EAST), Mumbai- 400063, Maharashtra, India
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">
                  <Phone />
                </span>
                <a href="tel:+919892352028" className="hover:text-orange-100">
                  +91 98923 52028
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">
                  <Mail />
                </span>
                <a
                  href={`mailto:${'support@craveon.net'}`}
                  className="hover:text-orange-100"
                >
                  {'support@craveon.net'}
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">
                  <Clock />
                </span>
                <span>9:30AM - 7:30PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social and App Download Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#FF6900]">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-[#FF6900]">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-[#FF6900]">
                <Instagram size={20} />
              </a>
            </div>

            {/* App Download */}
            <div className="flex space-x-4">
              <a href="#" className="hover:opacity-80 border border-white rounded">
                <img src={AppStore} alt="App Store" className="h-9" />
              </a>
              <a href="#" className="hover:opacity-80 border border-white rounded">
                <img src={WindowStore} alt="Microsoft Store" className="h-9" />
              </a>
              <a href="#" className="hover:opacity-80 bg-black rounded  border border-white">
                <img src={GooglePlay} alt="Google Play" className="h-8" />
              </a>
            </div>
          </div>

          {/* Copyright and Payment Methods */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white font-bold">All Right Reserved © 2025</p>
            <div className="flex space-x-2">
              <div className="h-6 w-10 flex items-center justify-center bg-white">
                <img
                  src="https://w7.pngwing.com/pngs/753/77/png-transparent-credit-card-visa-logo-payment-debit-card-visa-blue-company-text.png"
                  alt="Visa"
                  className="h-full object-contain"
                />
              </div>
              <div className="h-6 w-10 flex items-center justify-center bg-white">
                <img
                  src="https://w7.pngwing.com/pngs/675/932/png-transparent-card-master-master-card-master-card-new-logo-method-new-logo-payment-logos-icon.png"
                  alt="Mastercard"
                  className="h-full object-contain"
                />
              </div>
              <div className="h-6 w-10 flex items-center justify-center bg-white">
                <img
                  src="https://w7.pngwing.com/pngs/711/297/png-transparent-logo-american-express-payment-computer-icons-brand-american-express-blue-text-rectangle.png"
                  alt="AmEx"
                  className="h-full object-contain"
                />
              </div>
              <div className="h-6 w-10 bg-white flex items-center justify-center">
                <img
                  src="https://w7.pngwing.com/pngs/632/1015/png-transparent-paypal-logo-computer-icons-payment-paypal-blue-angle-service.png"
                  alt="PayPal"
                  className="h-full object-contain"
                />
              </div>
              <div className="h-6 w-10 flex items-center justify-center">
                <img
                  src="https://w7.pngwing.com/pngs/835/845/png-transparent-discover-card-discover-financial-services-credit-card-mastercard-american-express-credit-card-text-rectangle-orange.png"
                  alt="Discover"
                  className="h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
