import { Types } from "mongoose";

import cartModel from "../db/models/cart";

// cartiItem interface
export interface CartItem {
    bookId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface Cart {
    [x: string]: any;
    customerId: Types.ObjectId;
    items: CartItem[];
}

// cart strategy interface with an execute method
interface CartStrategy{
    executeStrategy(customerId: Types.ObjectId, item?: CartItem): Promise<Cart>;
}

class AddToCartStrategy implements CartStrategy {
    async executeStrategy(
        customerId: Types.ObjectId, 
        item: CartItem 
    ): Promise<Cart> {
        try {
            let cart = await cartModel.findOne({ customerId });
            if (!cart) {
                cart = await cartModel.create({ customerId, item: [] });
            }
            // check if items already exist in cart
            const existingItemIndex = cart.items.findIndex((i: { bookId: Types.ObjectId; }) => i.bookId.equals (item.bookId));
            if (existingItemIndex !== -1) {
                // if item already exists, update the quantity and price
                const existingItem = cart.items[existingItemIndex];
                existingItem.quantity += item.quantity;
                existingItem.price += item.price;
                cart.items[existingItemIndex] = existingItem;
            } else {
                cart.items.push(item);
            }
            await cart.save();
            return cart as Cart;
        } catch (error) {
            throw error;
        }
    }
}

class RemoveFromCartStrategy implements CartStrategy {
    async executeStrategy(customerId: Types.ObjectId, item: CartItem):Promise <Cart> {
        try {
            // retrieving book id from the item parameter
            const bookId = item.bookId;
            // querying the database to check if a cart exists for the customer
            const updatedCart = await cartModel.findOne({ customerId });
            if (updatedCart) {
                // check if the book has already been added to cart
                const itemIndex = updatedCart.items.findIndex((
                    cartItem: { bookId: Types.ObjectId }) => cartItem.bookId.equals(bookId));
                // if the book exists in cart, decrease the price and quantity
                if (itemIndex !== -1) {
                    // decrease the item quantity and price
                    const existingItem = updatedCart.items[itemIndex];
                    existingItem.quantity -= item.quantity;
                    existingItem.price -= item.price;

                    // if the book quantity becomes 0, remove the book from the cart
                    if (existingItem.quantity <= 0) {
                        updatedCart.items.splice(itemIndex, 1);
                    } else {
                        updatedCart.items[itemIndex] = existingItem;
                    }
                } else {
                    throw new Error("Item not found in cart");
                }
            } else {
                throw new Error("cart not found for customer");
            }
            // save the updated cart
            await updatedCart.save();
            return updatedCart as Cart;
        } catch (error) {
            throw error;
        }
    }
}

class GetCartStrategy implements CartStrategy {
    async executeStrategy(customerId?: Types.ObjectId): Promise<Cart> {
        try {
            const cart = await cartModel.findOne({ customerId });
            return cart ? cart.items : [];
        } catch (error) {
            throw error;
        }
    }
}

class ClearCartStrategy implements CartStrategy {
    async executeStrategy(customerId?: Types.ObjectId): Promise<Cart> {
        const deletedCart = await cartModel.findOneAndDelete(customerId);
        if(!deletedCart) {
            throw new Error("failed to delete cart");
        }
        return deletedCart as Cart;
    }
}

export class CartService {
    private addToCart: CartStrategy;
    private removeFromCart: CartStrategy;
    private getCart: CartStrategy;
    private clearCart: CartStrategy;
 
    constructor() {
        this.addToCart = new AddToCartStrategy();
        this.removeFromCart = new RemoveFromCartStrategy();
        this.getCart = new GetCartStrategy();
        this.clearCart = new ClearCartStrategy();
    }

    public async addCart(customerId: Types.ObjectId, item: CartItem): Promise<Cart> {
        return this.addToCart.executeStrategy(customerId, item);
    }

    public async removeCart(customerId: Types.ObjectId, item: CartItem): Promise<Cart> {
        return this.removeFromCart.executeStrategy(customerId, item);
    }

    public async viewCart(customerId: Types.ObjectId): Promise<Cart> {
        return this.getCart.executeStrategy(customerId);
    }

    public async deleteCart(customerId: Types.ObjectId): Promise<Cart> {
        return this.clearCart.executeStrategy(customerId);
    }

    public async calculateSubTotal(item: CartItem[]): Promise<number> {
        try {
            return item.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
        } catch(error) {
            throw error;
        }
    }
}