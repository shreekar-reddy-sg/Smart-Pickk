import { Product } from "../models/product.model.js";

const createProduct = async (req,res, next) => {
    try {
        const product = await Product.create(req.body); 
        res.status(201).json({ success: true,
            data: product
        });
    }
    catch(error) {
        next(error);
    }   
}

const fetchProducts = async (req,res, next) => {
    try {
        const { shopId } = req.params;
        const products = await Product.find({ shop: shopId });
        if(products.length !== 0) res.status(200).json({ success: true, data: products });
        else {
            const err = new Error("No products exist for this shop");
            err.statusCode = 404;
            throw err;
        }  
    }
    catch {
        next(error);
    }
}

export {
    createProduct,
    fetchProducts
};