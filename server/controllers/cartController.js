const Cart = require('../models/cartModel');
const ProductVariant = require('../models/productVariantModel');
const Product = require('../models/productModel');
const Image = require('../models/ProductImageModel');

exports.getAllCartItems = async (req, res) => {
    try {
        // console.log("Received headers:", req.headers);
        const userId = req.user?.userId || null;
        // const guestUserId = req.user?.guestUserId || null;
        const guestUserId = req.query.guestUserId || null;
        console.log("get all cart items request", req)
        console.log(`Authenticated User ID: ${userId}`);
        console.log(`Guest User ID: ${guestUserId}`);

        if (!userId && !guestUserId) {
            return res.status(400).json({ error: 'User ID or Guest User ID is required' });
        }

        const whereClause = userId ? { user_id: userId } : { guest_user_id: guestUserId };

        const cartItems = await Cart.findAll({
            where: whereClause,
            include: [
                {
                    model: ProductVariant,
                    as: 'productVariant',
                    attributes: ['id', 'product_id', 'color', 'size', 'stock_quantity', 'price'],
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

        if (!cartItems.length) {
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
        const { guest_user_id, product_variant_id, quantity } = req.body;
        const user_id = req.user?.userId || null; // Only set if authenticated

        console.log("Authenticated User ID:", user_id);
        console.log("Guest User ID:", guest_user_id);

        if (!product_variant_id || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let existingItem;

        if (user_id) {
            // Authenticated user: Look for cart item using user_id
            existingItem = await Cart.findOne({ where: { user_id, product_variant_id } });
        } else if (guest_user_id) {
            // Guest user: Look for cart item using guest_user_id
            existingItem = await Cart.findOne({ where: { guest_user_id, product_variant_id } });
        } else {
            return res.status(400).json({ error: 'User ID or Guest User ID is required' });
        }

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json({ message: 'Item quantity updated', cartItemId: existingItem.id });
        }

        // Ensure we store user_id only for authenticated users, and guest_user_id only for guests
        const newItem = await Cart.create({
            user_id: user_id || null, // Store only if authenticated
            guest_user_id: user_id ? null : guest_user_id, // Store only if guest
            product_variant_id,
            quantity
        });

        console.log("Cart Item Created:", newItem);
        res.status(201).json({ message: 'Item added to cart', cartItemId: newItem.id });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const guest_user_id = parseInt(req.user.guestUserId) || null;
        const user_id = req.user.userId || null;
        const cart_item_id  = req.params.cart_item_id;  // Get from URL

        const { product_id, quantity } = req.body;

        if ((!user_id && !guest_user_id) || !product_id || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const whereClause = user_id ? { user_id } : { guest_user_id };
        const cartItem = await Cart.findOne({ where: { ...whereClause, id: cart_item_id} });
        await cartItem.destroy();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error("error", err);
        res.status(500).json({ error: 'Error removing cart item' })
    }
}

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

exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart_item_id = req.params.cart_item_id;

        if (!cart_item_id || quantity === undefined) {
            return res.status(400).json({ error: "Cart Item ID and quantity are required" });
        }

        const cartItem = await Cart.findOne({ where: { id: cart_item_id } });

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        if (quantity <= 0) {
            await cartItem.destroy();
            return res.status(200).json({ message: "Item removed from cart" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Cart item quantity updated", cartItemId: cartItem.id });
    } catch (err) {
        console.error("Cannot update cart item quantity:", err);
        res.status(500).json({ error: "Error updating cart item quantity" });
    }
};
