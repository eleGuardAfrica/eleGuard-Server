import User from "../models/User"
import Customer from "../models/Customer"
import Device from "../models/Device"
import Alert from "../models/Alert"
import Billing from "../models/Billing"
import { ConnectToDatabase } from "../config/databaseconnection"

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...")

    ConnectToDatabase();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Device.deleteMany({}),
      Alert.deleteMany({}),
      Billing.deleteMany({}),
    ])

    console.log("🧹 Cleared existing data")

    // Create Super Admin
    const superAdmin = new User({
      name: "John Super Admin",
      email: "john@eleguard.com",
      password: "password123",
      phoneNumber: 712345678,
      isAdmin: true,
      isSuperAdmin: true,
      isVerified: true,
    })
    await superAdmin.save()

    // Create Regular Admin
    const admin = new User({
      name: "Sarah Admin",
      email: "sarah@eleguard.com",
      password: "password123",
      phoneNumber: 723456789,
      isAdmin: true,
      isSuperAdmin: false,
      createdBy: superAdmin._id,
      isVerified: true,
    })
    await admin.save()

    // Create Regular User
    const regularUser = new User({
      name: "Alice Manager",
      email: "alice@eleguard.com",
      password: "password123",
      phoneNumber: 745678901,
      isAdmin: false,
      createdBy: superAdmin._id,
      isVerified: true,
    })
    await regularUser.save()

    // Update super admin's created users
    superAdmin.createdUsers = [admin._id, regularUser._id]
    await superAdmin.save()

    console.log("👥 Created users")

    // Create Customers
    const customers = await Customer.create([
      {
        name: "Maasai Wildlife Conservancy",
        email: "contact@maasaiwildlife.org",
        phoneNumber: "0712345678",
        location: "Maasai Mara, Kenya",
      },
      {
        name: "Amboseli Elephant Trust",
        email: "info@amboselielephants.org",
        phoneNumber: "0723456789",
        location: "Amboseli National Park, Kenya",
      },
      {
        name: "Tsavo Conservation Area",
        email: "admin@tsavoconservation.org",
        phoneNumber: "0734567890",
        location: "Tsavo National Park, Kenya",
      },
    ])

    console.log("🏢 Created customers")

    // Create Devices
    const devices = await Device.create([
      // Used devices
      {
        serialNumber: "EG-001-2024",
        isUsed: true,
        customerId: customers[0]._id,
        customerName: customers[0].name,
        location: "Sector A - North Boundary",
        batteryLevel: 85,
        lastSeen: new Date(),
        status: "active",
        listToBeNotified: [
          { name: "James Kimani", phoneNumber: "0712345678" },
          { name: "Mary Wanjiku", phoneNumber: "0723456789" },
        ],
      },
      {
        serialNumber: "EG-002-2024",
        isUsed: true,
        customerId: customers[0]._id,
        customerName: customers[0].name,
        location: "Sector B - East Boundary",
        batteryLevel: 23,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "active",
        listToBeNotified: [{ name: "James Kimani", phoneNumber: "0712345678" }],
      },
      {
        serialNumber: "EG-003-2024",
        isUsed: true,
        customerId: customers[1]._id,
        customerName: customers[1].name,
        location: "Observation Point Alpha",
        batteryLevel: 67,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: "active",
        listToBeNotified: [{ name: "Dr. Joyce Poole", phoneNumber: "0734567890" }],
      },
      // Unused devices
      {
        serialNumber: "EG-004-2024",
        isUsed: false,
        batteryLevel: 100,
        status: "inactive",
      },
      {
        serialNumber: "EG-005-2024",
        isUsed: false,
        batteryLevel: 100,
        status: "inactive",
      },
    ])

    console.log("📱 Created devices")

    // Update customer device references
    customers[0].devices = [devices[0]._id, devices[1]._id]
    customers[1].devices = [devices[2]._id]
    await customers[0].save()
    await customers[1].save()

    // Create Alerts
    await Alert.create([
      {
        deviceId: devices[1]._id, // Low battery device
        customerId: customers[0]._id,
        type: "low_battery",
        severity: "high",
        message: `Device ${devices[1].serialNumber} battery level critically low (23%)`,
        location: devices[1].location,
        acknowledged: false,
      },
      {
        deviceId: devices[0]._id,
        customerId: customers[0]._id,
        type: "intrusion",
        severity: "critical",
        message: "Elephant intrusion detected at North Boundary",
        location: devices[0].location,
        acknowledged: true,
        acknowledgedBy: superAdmin._id,
        acknowledgedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        deviceId: devices[2]._id,
        customerId: customers[1]._id,
        type: "intrusion",
        severity: "medium",
        message: "Wildlife activity detected near observation point",
        location: devices[2].location,
        acknowledged: false,
      },
    ])

    console.log("🚨 Created alerts")

    // Create Billing Records
    await Billing.create([
      {
        customerId: customers[0]._id,
        customerName: customers[0].name,
        plan: "premium",
        monthlyFee: 299,
        devicesIncluded: 5,
        additionalDeviceFee: 50,
        currentDevices: 2,
        lastBillingDate: new Date(2024, 0, 1), // January 1, 2024
        nextBillingDate: new Date(2024, 1, 1), // February 1, 2024
        status: "active",
        totalAmount: 299,
      },
      {
        customerId: customers[1]._id,
        customerName: customers[1].name,
        plan: "basic",
        monthlyFee: 149,
        devicesIncluded: 3,
        additionalDeviceFee: 50,
        currentDevices: 1,
        lastBillingDate: new Date(2024, 0, 1),
        nextBillingDate: new Date(2024, 1, 1),
        status: "active",
        totalAmount: 149,
      },
    ])

    console.log("💳 Created billing records")

    console.log("✅ Database seeding completed successfully!")
    console.log("🔐 Test login credentials:")
    console.log("  Super Admin: john@eleguard.com / password123")
    console.log("  Admin: sarah@eleguard.com / password123")
    console.log("  User: alice@eleguard.com / password123")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
  } finally {
    process.exit()
  }
}

// Run the seeding
seedDatabase()
