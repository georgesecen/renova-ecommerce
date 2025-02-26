const Cart = require('../models/cartModel');
const ProductVariant = require('../models/productVariantModel');
const Product = require('../models/productModel');
const Image = require('../models/ProductImageModel');

exports.getAllCartItems = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId)
        if (!userId) {
            console.log("no user id")
            return res.status(400).json({ error: 'User ID is required' });
        }

        console.log(`Fetching cart items for user ID: ${userId}`);

        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: ProductVariant,
                    as: 'productVariant',
                    attributes: ['id', 'product_id', 'color', 'size', 'stock_quantity', 'price'],
                    //Join tables
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'description', 'price'],
                            include: [
                                {
                                    model: Image,
                                    as: 'image',
                                    attributes: ['image_url', 'is_primary'],
                                }
                            ]
                        }
                    ]
                }
            ],
            attributes: ['id', 'quantity', 'createdAt', 'updatedAt']
        });
        //Check if cart is empty
        if (!cartItems.length) {
            console.log('no items in the cart')
            return res.status(200).json([]);
        }
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
};
// Get a single cart item by ID
exports.getCartItem = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const cartItemId = req.params.cart_item_id;
        if (!userId || !cartItemId) {
            return res.status(400).json({ error: 'User ID and Cart Item ID are required' });
        }
        const cartItem = await Cart.findOne({ where: { id: cartItemId, user_id: userId } });
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.status(200).json(cartItem);
    } catch (error) {
        console.error('Error fetching cart item:', error);
        res.status(500).json({ error: 'Error fetching cart item' });
    }
};

// Add or update a cart item
exports.addCartItem = async (req, res) => {
    try {
        const user_id = req.user.userId;
        console.log("User ID from addCartItem method:", user_id);
        const { product_variant_id, quantity } = req.body;
        if (!user_id || !product_variant_id || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingItem = await Cart.findOne({ where: { user_id, product_variant_id } });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json({ message: 'Item quantity updated', cartItemId: existingItem.id });
        }

        const newItem = await Cart.create({ user_id, product_variant_id, quantity });
        res.status(201).json({ message: 'Item added to cart', cartItemId: newItem.id });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
};

// Remove cart item or decrease quantity
exports.removeCartItem = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const cart_item_id  = req.params.cart_item_id;  // Get from URL

        const { product_id, quantity } = req.body;

        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const cartItem = await Cart.findOne({ where: { user_id, id: cart_item_id} });
        console.log(cartItem);
        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        if (cartItem.quantity > quantity) {
            cartItem.quantity -= quantity;
            await cartItem.save();
            return res.status(200).json({ message: 'Item quantity updated', cartItemId: cartItem.id });
        }

        await cartItem.destroy();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ error: 'Error removing cart item' });
    }
};

exports.getCartQuantity = async (req, res) => {
    try {
        const user_id = req.user.userId;
        console.log("cartquantity from cart controller: ",user_id)
        if (!user_id) return res.status(400).json({ error: "User ID required" });

        const cartItems = await Cart.findAll({ where: { user_id } });

        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        res.status(200).json({ cartQuantity: totalQuantity });
    } catch (err) {
        console.error('Error fetching cartQuantity:', err);
        res.status(500).json({ error: "Error fetching cart quantity" });
    }
}
