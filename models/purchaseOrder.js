const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  vendor: {
    type: String,
  },
  poNumber: {
    type: String,
  },
  poDate: {
    type: Date,
  },
  location: {
    type: String,
  },
  items: [
    {
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      amount: {
        type: Number,
      },
      discount: {
        type: Number,
      },
      tax: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },
  ],
});

module.exports = PurchaseOrder = mongoose.model(
  "PurchaseOrder",
  purchaseOrderSchema
);
