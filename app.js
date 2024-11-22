import express from "express";
import { connectDB, client } from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

const db = client.db("mydatabase");
const productsCollection = db.collection("products");

app.post("/products", async (req, res) => {
  try {
    const product = req.body;
    const result = await productsCollection.insertOne(product);
    res.status(201).send(result.ops[0]);
  } catch (error) {
    res.status(500).send("Error creating product: " + error.message);
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("Error retrieving products: " + error.message);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productsCollection.findOne({
      _id: new require("mongodb").ObjectID(id),
    });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send("Error retrieving product: " + error.message);
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;
    const result = await productsCollection.updateOne(
      { _id: new require("mongodb").ObjectID(id) },
      { $set: updatedProduct }
    );
    if (result.matchedCount === 0) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Product updated successfully");
  } catch (error) {
    res.status(500).send("Error updating product: " + error.message);
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productsCollection.deleteOne({
      _id: new require("mongodb").ObjectID(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting product: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
