import Nav from "../navbar/Nav";
import Footer from "./Footer";


export default function AboutUs() {
    return (
        <>
            <Nav />
            <div className="max-w-3xl mx-auto p-6 text-gray-800">
                {/* ====================  Header  ==================== */}
                <h1 className="text-3xl font-bold mb-6">About CRAVEON</h1>

                {/* ====================  Intro Paragraph  ==================== */}
                <p className="mb-6 leading-relaxed">
                    CRAVEON is more than just a food delivery app—it's your passport to culinary convenience.
                    We understand the craving for delicious food delivered fast, fresh, and right to your door.
                    That's why we created CRAVEON: to seamlessly connect you with your favorite local restaurants
                    and discover exciting new flavors, all at the tap of a button.
                </p>

                {/* ====================  Brand Info  ==================== */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-3">A Brand of Techvertico Consulting LLP</h2>
                    <p className="leading-relaxed">
                        CRAVEON is a brand registered under <strong>Techvertico Consulting LLP</strong>,
                        a firm committed to leveraging technology to build innovative, user-centric solutions.
                        Backed by Techvertico's expertise in technology, logistics, and customer experience,
                        we are dedicated to setting a new standard for food delivery services.
                        Our foundation in cutting-edge technology ensures that your ordering experience is smooth,
                        reliable, and secure.
                    </p>
                </section>

                {/* ====================  Mission  ==================== */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                    <p className="leading-relaxed">
                        Our mission is simple: <strong>To make ordering food effortless and enjoyable.</strong><br />
                        We strive to empower local restaurants by expanding their reach and providing a reliable
                        delivery platform, while giving our users instant access to a diverse world of cuisines,
                        whenever and wherever their cravings hit.
                    </p>
                </section>

                {/* ====================  What Makes Us Unique  ==================== */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-3">What Makes CRAVEON Unique?</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Diverse Choices:</strong> From quick bites to gourmet meals, we partner with a wide
                            variety of restaurants to satisfy every palate and budget.
                        </li>
                        <li>
                            <strong>Speed and Reliability:</strong> We utilize smart logistics and technology developed
                            by Techvertico to ensure your food is delivered hot and on time.
                        </li>
                        <li>
                            <strong>User-Centric Design:</strong> Our app is designed for simplicity, making it easy
                            to browse, order, track, and pay.
                        </li>
                        <li>
                            <strong>Commitment to Quality:</strong> We maintain high standards for our restaurant
                            partners and delivery professionals to ensure the best possible experience for you.
                        </li>
                    </ul>
                </section>

                {/* ====================  Closing Message  ==================== */}
                <p className="italic text-lg mb-4">
                    <strong>CRAVEON: Satisfy Your Hunger, Effortlessly.</strong>
                </p>

                <p className="text-lg mb-4">
                    Thank you for choosing us. We look forward to serving you!
                </p>
            </div>
            <Footer />
        </>
    );
}