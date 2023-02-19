const PurchaseOrder = require("../models/purchaseOrder");
const OrderNumber = require("../models/orderNumber");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const purchaseList = await PurchaseOrder.find();

  if (!purchaseList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(purchaseList);
});

router.get("/order-number", async (req, res) => {
  try {
    const vendors = ["Shamnad", "Shaji", "akshay", "anoop"];
    const products = ["Mobile", "Laoptop", "Earphone", "Display"];
    let order = await OrderNumber.findOne({});

    if (!order) {
      order = { orderNumber: "PO_000000" };
      try {
        const orderNum = new OrderNumber({
          orderNumber: order.orderNumber,
        });
        orderNum
          .save()
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
    console.log(order.orderNumber);
    const poNo =
      "PO_" +
      (order.orderNumber.substring(3) * 1 + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 6,
        useGrouping: false,
      });

    const poDate = new Date();
    res.json({
      vendors: vendors,
      products: products,
      poNo: poNo,
      poDate: poDate,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const purchaseorder = await PurchaseOrder.findById(req.params.id);
  console.log(purchaseorder);
  if (!purchaseorder) {
    res
      .status(500)
      .json({ message: "The purchaseorder with the given ID was not found." });
  }
  res.status(200).send(purchaseorder);
});


router.post("/", async (req, res) => {
  const poDate = new Date();
 
  let order = await OrderNumber.findOne({});
  const poNo =
    "PO_" +
    (order.orderNumber.substring(3) * 1 + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 6,
      useGrouping: false,
    });
  const purchaseOrder = new PurchaseOrder({
    vendor: req.body.vendor,
    poNumber: poNo,
    poDate: poDate,
    location: req.body.location,
    items: req.body.items.map((item) => {
      return {
        productName: item.productName,
        quantity: item.quantity,
        amount: item.amount,
        discount: item.discount,
        tax: item.tax,
        total: item.total,
      };
    }),
  });

  const savedPurchaseOrder = await purchaseOrder.save();

  if (!savedPurchaseOrder) {
    return res.status(400).send("The purchase order could not be created.");
  }
  try {
    await OrderNumber.updateOne({}, { $set: { orderNumber: poNo } });
  } catch (err) {
    console.log(err);
  }
  res.send(savedPurchaseOrder);
});


router.put("/:id", async (req, res) => {
  const existingOrder = await PurchaseOrder.findOne({
    poNumber: req.body.poNumber,
  });

  if (existingOrder) {
    return res
      .status(400)
      .send(
        `A purchase order with the PO number ${req.body.poNumber} already exists.`
      );
  }
  const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    req.params.id,
    {
      vendor: req.body.vendor,
      location: req.body.location,
      items: req.body.items.map((item) => {
        return {
          productName: item.productName,
          quantity: item.quantity,
          amount: item.amount,
          discount: item.discount,
          tax: item.tax,
          total: item.total,
        };
      }),
    },
    { new: true }
  );

  if (!purchaseOrder)
    return res.status(400).send("the purcahse cannot be created!");

  res.send(purchaseOrder);
});

router.delete("/:id", (req, res) => {
  PurchaseOrder.findByIdAndRemove(req.params.id)
    .then((purchaseOrder) => {
      if (purchaseOrder) {
        return res
          .status(200)
          .json({ success: true, message: "the purchase order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "purcase order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
