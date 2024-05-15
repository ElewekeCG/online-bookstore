// importing the cart service class and the cartItem interface
import { CartService, CartItem } from "./cart-service";
// importing the order schema model
import orderModel from "../db/models/orders";
import { Types } from "mongoose";
// importing inventory facade 
import { InventoryFacade } from "./inventory-service";

// defining an interface to specify the order structure
export interface Order {
    customerId: Types.ObjectId;
    orderDate: Date;
    subTotal: number;
    shippingAddress: Types.ObjectId;
    booksOrdered: CartItem[]; // Array of ordered books 
}
// creating and order factory class
// the methods in the order factory can only be accessed by its subclasses
class OrderFactory {
    private readonly cartService: CartService;
    constructor(cartService: CartService) {
        this.cartService = cartService;
    }

    /*method to create an order, takes in customer id and shipping address 
    and returns the created order*/
    protected async createOrder(
        customerId: Types.ObjectId, 
        shippingAddress: Types.ObjectId
    ): Promise<Order> {
        // check if the customer has items in their cart
        const cartItems = await this.cartService.viewCart(customerId);
        // if cart is empty
        if(cartItems.length === 0) {
            throw new Error("cart is empty");
        }
        /*if items exist in a customer's cart, iterate over the cart items and store them
        in an array*/
        const itemsForAvailabilityCheck = cartItems.map((
            item: { bookId: Types.ObjectId; quantity: number; price: number; }) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price
        }));
        // call the inventory facade method to check if items are available and update their quantities
        try {
            const availableItems = await new InventoryFacade().updateQuantityAfterOrder(itemsForAvailabilityCheck);
            // calculating the subtotal of available items
            let subtotal = 0;
            for(const item of availableItems){
                subtotal += item.price * item.quantity;
            }
        // create an instance of the order schema with the various items that are required
            const newOrder = await orderModel.create({
                customerId,
                orderDate: new Date(),
                subTotal: subtotal,
                shippingAddress,
                booksOrdered: availableItems
            })
            // checking if the creation was successful
            if(!newOrder){
                throw new Error("failed to create order");
            }
            // clear customer's cart after successful order creation
            await this.cartService.deleteCart(customerId);
            // if successful, return the newly created order
            return newOrder as Order;
        } catch(error) {
            console.error(error);
            throw error;
        }

    }

    /* method to view orders, takes in customer id as request parameter
    and returns a promise of type order*/
    protected async viewOrder(customerId: Types.ObjectId):Promise<Order> {
        try{
            // querying the order schema to see if any order matches the customer id
            const customerOrder = await orderModel.findOne({customerId})
            
            // if there is no match, an error is thrown
            if(!customerOrder) {
                throw new Error("no order has been placed by this customer");
            }
            // if there is a match, the customer's order is returned
            return {
                customerId: customerOrder.customerId,
                orderDate: customerOrder.orderDate,
                subTotal: customerOrder.subTotal,
                shippingAddress: customerOrder.shippingAddress,
                booksOrdered: customerOrder.booksOrdered.map((item: { bookId: Types.ObjectId; quantity: number; price: number; }) => ({
                    bookId: item.bookId,
                    quantity: item.quantity,
                    price: item.price
                }))
        }
        } catch(error) {
            throw error;
        }
    }
}

/*creating an order service class that inherits the order factory and 
the idea is that for future app releases, more order class types can inherit from the 
order factory and create different types of orders*/
export class OrderService extends OrderFactory {
    public async createOrder(
        customerId: Types.ObjectId,
        shippingAddress: Types.ObjectId
    ):Promise <Order> {
        // awaiting order creation fron the super class
      return await super.createOrder(customerId, shippingAddress);
    }

    public async view(customerId: Types.ObjectId): Promise<any> {
        return await super.viewOrder(customerId);
    }
  }

