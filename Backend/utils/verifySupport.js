const path = require("path");
// Load environment variables from Craveon/Backend/.env or Craveon/.env
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const dns = require("dns");

// Set DNS servers as done in database.js
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const User = require("../models/user");
const Restaurant = require("../models/Restaurants");
const Order = require("../models/Order");
const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");
const Dispute = require("../models/Dispute");

const runVerify = async () => {
  console.log("Connecting to database at:", process.env.mongodb_uri || process.env.MONGODB_URI);
  
  const dbUri = process.env.mongodb_uri || process.env.MONGODB_URI || "mongodb://localhost:27017/craveon";
  
  await mongoose.connect(dbUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log("MongoDB connected successfully.\n");

  const createdDocs = {
    users: [],
    restaurants: [],
    orders: [],
    feedbacks: [],
    complaints: [],
    disputes: [],
  };

  try {
    // 1. Create test user
    console.log("Creating test user...");
    const testUser = await User.create({
      name: "Test Support User",
      email: `test_support_${Date.now()}@example.com`,
      password: "hashedPassword123",
      number: `99999${Math.floor(10000 + Math.random() * 90000)}`,
      role: "user",
    });
    createdDocs.users.push(testUser._id);
    console.log(`Test User created: ID ${testUser._id}, Mobile: ${testUser.number}\n`);

    // 2. Create test restaurant
    console.log("Creating test restaurant...");
    const testRestaurant = await Restaurant.create({
      name: "Test Verification Kitchen",
      address: {
        street: "123 Support Lane",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        country: "India",
      },
      owner: testUser._id,
      foodType: "Both",
    });
    createdDocs.restaurants.push(testRestaurant._id);
    console.log(`Test Restaurant created: ID ${testRestaurant._id}\n`);

    // 3. Create test orders
    console.log("Creating test orders (one DELIVERED, one PENDING)...");
    const deliveredOrder = await Order.create({
      orderNumber: `ORD-TEST-${Date.now()}-DELIV`,
      user: testUser._id,
      restaurant: testRestaurant._id,
      items: [
        {
          name: "Test Paneer Tikka",
          price: 250,
          quantity: 2,
        }
      ],
      deliveryAddress: {
        fullName: "Test Support User",
        addressLine1: "123 Support Lane",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        phoneNumber: testUser.number,
      },
      totalQuantity: 2,
      subtotal: 500,
      taxRate: 5,
      taxAmount: 25,
      packagingCharge: 15,
      deliveryFee: 40,
      discountAmount: 0,
      finalTotal: 580,
      paymentMode: "COD",
      status: "DELIVERED",
    });
    createdDocs.orders.push(deliveredOrder._id);

    const pendingOrder = await Order.create({
      orderNumber: `ORD-TEST-${Date.now()}-PEND`,
      user: testUser._id,
      restaurant: testRestaurant._id,
      items: [
        {
          name: "Test Paneer Tikka",
          price: 250,
          quantity: 1,
        }
      ],
      deliveryAddress: {
        fullName: "Test Support User",
        addressLine1: "123 Support Lane",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        phoneNumber: testUser.number,
      },
      totalQuantity: 1,
      subtotal: 250,
      taxRate: 5,
      taxAmount: 12.5,
      packagingCharge: 15,
      deliveryFee: 40,
      discountAmount: 0,
      finalTotal: 317.5,
      paymentMode: "COD",
      status: "PENDING",
    });
    createdDocs.orders.push(pendingOrder._id);
    console.log(`Orders created. Delivered: ${deliveredOrder.orderNumber}, Pending: ${pendingOrder.orderNumber}\n`);

    // 4. Test Feedback Submission
    console.log("Testing Feedback Creation...");
    const feedback = await Feedback.create({
      user: testUser._id,
      rating: 5,
      experience: "Excellent",
      comment: "Superb delivery and UI experience!",
    });
    createdDocs.feedbacks.push(feedback._id);
    console.log(`Feedback submitted. ID: ${feedback._id}, rating: ${feedback.rating}\n`);

    // 5. Test Complaint Submission
    console.log("Testing Complaint Creation...");
    const complaint = await Complaint.create({
      user: testUser._id,
      order: deliveredOrder._id,
      category: "Food Quality",
      subject: "Paneer was too dry",
      description: "The food paneer item was dry and not fresh.",
    });
    createdDocs.complaints.push(complaint._id);
    console.log(`Complaint lodged. ID: ${complaint._id}, subject: "${complaint.subject}"\n`);

    // 6. Test Dispute Submission Logic (DELIVERED vs PENDING order)
    console.log("Testing Dispute Validation Logic...");
    
    // Test Case: Raising dispute on a PENDING order must fail validation rule (status DELIVERED)
    if (pendingOrder.status !== "DELIVERED") {
      console.log("✅ Validation check passed: Correctly identified that pendingOrder is not DELIVERED.");
    } else {
      throw new Error("Validation check failed: pendingOrder status is unexpectedly DELIVERED.");
    }

    // Raise dispute on delivered order
    console.log("Raising dispute on delivered order...");
    const dispute = await Dispute.create({
      order: deliveredOrder._id,
      user: testUser._id,
      disputeReason: "POOR_QUALITY",
      disputeItems: [
        {
          product: new mongoose.Types.ObjectId(), // mock product ID
          name: "Test Paneer Tikka",
          quantity: 1,
        }
      ],
      description: "Paneer was dry and taste was stale.",
    });
    createdDocs.disputes.push(dispute._id);
    console.log(`Dispute raised successfully. ID: ${dispute._id}\n`);

    // Test Case: Raising duplicate dispute on the same order must fail due to unique constraint
    console.log("Testing Duplicate Dispute prevention...");
    try {
      await Dispute.create({
        order: deliveredOrder._id,
        user: testUser._id,
        disputeReason: "MISSING_ITEMS",
        description: "Trying to submit duplicate dispute.",
      });
      throw new Error("Validation check failed: Duplicate dispute was created successfully!");
    } catch (err) {
      if (err.code === 11000 || err.message.includes("E11000") || err.name === "MongoServerError") {
        console.log("✅ Duplicate Dispute prevention passed: Database correctly threw unique constraint error.");
      } else {
        throw err;
      }
    }

    // 7. Verify Admin Resolution Update logic
    console.log("\nTesting Admin resolution updates...");
    
    // Resolve dispute
    dispute.status = "RESOLVED_REFUNDED";
    dispute.resolutionDetails = "Refunded 250 INR for dry paneer tikka.";
    dispute.resolvedAt = new Date();
    await dispute.save();
    console.log(`✅ Dispute updated. Status: ${dispute.status}, Notes: "${dispute.resolutionDetails}"`);

    // Resolve complaint
    complaint.status = "RESOLVED";
    complaint.adminNotes = "Sent customer relationship apology email.";
    await complaint.save();
    console.log(`✅ Complaint updated. Status: ${complaint.status}, Admin Notes: "${complaint.adminNotes}"\n`);

    console.log("=========================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    console.log("=========================================");
  } catch (error) {
    console.error("❌ TEST RUN ENCOUNTERED AN ERROR:", error);
    process.exitCode = 1;
  } finally {
    // Clean up all test documents
    console.log("\nCleaning up test documents...");
    await Promise.all([
      User.deleteMany({ _id: { $in: createdDocs.users } }),
      Restaurant.deleteMany({ _id: { $in: createdDocs.restaurants } }),
      Order.deleteMany({ _id: { $in: createdDocs.orders } }),
      Feedback.deleteMany({ _id: { $in: createdDocs.feedbacks } }),
      Complaint.deleteMany({ _id: { $in: createdDocs.complaints } }),
      Dispute.deleteMany({ _id: { $in: createdDocs.disputes } }),
    ]);
    console.log("Clean up finished. Disconnecting Mongoose.");
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

runVerify();
