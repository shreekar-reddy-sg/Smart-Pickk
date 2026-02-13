import { Product } from "../models/product.model.js";

const createProduct = async (req,res) => {
    try {
        const product = await Product.create(req.body); 
        res.status(201).json({ message: "Product created successfully",
            data: product
        });
    }
    catch(error) {
        res.status(500).json({ message: "Internal server error"});
    }   
}

const fetchProducts = async (req,res) => {
    try {
        const { shopId } = req.params;
        const products = await Product.find({ shop: shopId });
        if(products.length !== 0) res.status(200).json(products);
        else res.status(404).json({message: "No products exist!"})  
    }
    catch {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {
    createProduct,
    fetchProducts
};