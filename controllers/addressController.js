const Address = require("../models/address");

// Get all addresses
exports.getAddresses = async (req, res) => {
  const addresses = await Address.find();
  console.log(addresses);
  res.json(addresses);
};

// Add new address
exports.addAddress = async (req, res) => {
  const newAddress = new Address(req.body);
  await newAddress.save();
  res.status(201).json(newAddress);
};

// Edit existing
exports.updateAddress = async (req, res) => {
  const updated = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// Delete
exports.deleteAddress = async (req, res) => {
  await Address.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

// Bulk import
exports.bulkImport = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text input is required" });
    }

    // Regex to find all "Відділення №..." blocks within one single line
    const regex =
      /(.*?)обл\.,\s*(.*?),\s*Відділення №(\d+).*?:\s*(.*?),\s*\+?(\d+),\s*(пн[^\s,]+.*?)\s*,\s*(сб[^\s,]+.*?)(?=(?:[А-ЯІЇЄҐA-Z].*?обл\.|$))/g;

    const addresses = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [_, region, city, branchNumber, address, phone, monWed, satSun] =
        match;

      addresses.push({
        region: region.trim(),
        city: city.trim(),
        branchNumber: branchNumber.trim(),
        address: address.trim(),
        phone: `+${phone.trim()}`,
        workingHours: { monWed: monWed.trim(), satSun: satSun.trim() },
      });
    }

    if (addresses.length === 0) {
      return res.status(400).json({ error: "No valid addresses found." });
    }

    const saved = await Address.insertMany(addresses);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Bulk import error:", err);
    res.status(500).json({ error: "Server error during bulk import" });
  }
};
