import { Router } from "express";
import { Delivery } from "../models/Delivery";
import { Bid } from "../models/Bid";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      clientId,
      pickupLocation,
      dropoffLocation,
      packageDetails,
      suggestedPrice,
    } = req.body;

    if (
      !clientId ||
      !pickupLocation ||
      !dropoffLocation ||
      !packageDetails ||
      suggestedPrice == null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const delivery = await Delivery.create({
      clientId,
      pickupLocation,
      dropoffLocation,
      packageDetails,
      suggestedPrice,
      status: "pending",
    });

    return res.status(201).json(delivery);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    return res.json(delivery);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:id/bids", async (req, res) => {
  try {
    const { courierId, amount, estimatedTime, message } = req.body;
    const { id: deliveryId } = req.params;

    if (!courierId || !amount || !estimatedTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const bid = await Bid.create({
      deliveryId,
      courierId,
      amount,
      estimatedTime,
      message,
    });

    return res.status(201).json(bid);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id/bids", async (req, res) => {
  try {
    const bids = await Bid.find({ deliveryId: req.params.id }).sort({
      createdAt: -1,
    });
    return res.json(bids);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

