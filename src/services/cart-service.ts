// importing types from mongoose in order to access the object id variable
import { Types } from "mongoose";

// importing the cart schema model
import cartModel from "../db/models/cart";

// cartiItem interface specifies the required data for cart creation
export interface CartItem {
    bookId: Types.ObjectId;
    quantity: number;
    price: number;
}

// specify the return format for created carts based on the cart schema model
export interface Cart {
    [x: string]: any;
    customerId: Types.ObjectId;
    items: CartItem[];
}

/*cart strategy interface defines an execute method for carrying out 
different cart operations*/
interface CartStrategy{
    // the item? specifies that a value for item is optional because not all operations
    // need to pass it to the execute strategy
    executeStrategy(customerId: Types.ObjectId, item?: CartItem): Promise<Cart>;
}

// this class implements the strategy interface and calls the execute method
class AddToCartStrategy implements CartStrategy {
    async executeStrategy(
        customerId: Types.ObjectId, 
        item: CartItem 
    ): Promise<Cart> {
        try {
            // query the cart schema to see if the said customer already has a cart
            let cart = await cartModel.findOne({ customerId });
            // if there is no cart, a new one is created for the customer
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
                // add items to the existing cart array
                cart.items.push(item);
            }
            // save the updated cart
            await cart.save();
            // return the cart as the response
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
    // calling the execute strategy and passing the customer id to it
    async executeStrategy(customerId: Types.ObjectId): Promise<Cart> {
        try {
            // querying the schema model
            const cart = await cartModel.findOne({ customerId });
            // using a teneray operator, if there items in the cart, the response will be
            // the the cart and its items, else the response will be an empty array
            return cart ? cart.items : [];
        } catch (error) {
            throw error;
        }
    }
}


class ClearCartStrategy implements CartStrategy {
    async executeStrategy(customerId?: Types.ObjectId): Promise<Cart> {
        // find the cart for a particular customer and delete it
        const deletedCart = await cartModel.findOneAndDelete(customerId);
        if(!deletedCart) {
            throw new Error("failed to delete cart");
        }
        // return the deleted cart
        return deletedCart as Cart;
    }
}

// cart service class creates instances of the cart strategies and makes them available to the client
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

    // an extra method to calculate the subtotal for items in a cart
}