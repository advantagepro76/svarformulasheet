// server/routes/saveFormula.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/save-formula", async (req, res) => {
  try {
    const { name, code, totalCost, totalQuantity, items } = req.body;

    const formula = await prisma.formula.create({
      data: {
        name,
        code,
        totalCost,
        totalQuantity,
        items: {
          create: items.map(item => ({
            rawMaterial: item.rawMaterial,
            quantityInGrams: item.quantityInGrams,
            pricePerKg: item.pricePerKg,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    res.status(200).json({ success: true, formula });
  } catch (error) {
    console.error("Save formula error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
