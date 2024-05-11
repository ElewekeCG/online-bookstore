import { InventoryFacade } from "./inventory-service";
import { CartService, CartItem } from "./cart-service";
import orderModel from "../db/models/orders";
import { Types } from "mongoose";

export interface Order {
    orderDate: Date;
    subtotal: number;
    shippingAddress: string;
    bookOrdered: CartItem[]; // Array of ordered books 
}

// the methods in the order factory can only be accessed by its subclasses
class OrderFactory {
    private readonly cartService: CartService;
    private readonly inventory: InventoryFacade;

    constructor(
        cartService: CartService, 
        inventory: InventoryFacade
    ) {
        this.cartService = cartService;
        this.inventory = inventory;
    }

    protected async createOrder(
        customerId: Types.ObjectId, 
        shippingAddress: string
    ): Promise<Order> {
        const cartItems = await this.cartService.viewCart(customerId);
        const itemsForAvailabilityCheck = cartItems.map((
            item: { bookId: Types.ObjectId; quantity: number; }) => ({
            bookId: item.bookId,
            quantity: item.quantity
        }));
        const verifyAvailability = await this.inventory.checkAvailability(itemsForAvailabilityCheck);

        if(!verifyAvailability) {
            throw new Error('some items are unavailable');
        }
        
        const subTotal = await this.cartService.calculateSubTotal(cartItems.items);
        const order: Order = {
            orderDate: new Date(),
            subtotal: subTotal,
            shippingAddress,
            bookOrdered: cartItems.items.map((item: CartItem) => ({
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.price
            }))
        };

        return order;
    }

    protected async viewOrder(customerId: Types.ObjectId):Promise<Order> {
        const customerOrder = await orderModel.findOne({ customerId });
        if(!customerOrder) {
            throw new Error("no order has been placed by this customer");
        }
        return customerOrder.toJSON() as Order;
    }
}

export class OrderService extends OrderFactory {
    public async createOrder(
        customerId: Types.ObjectId,
        shippingAddress: string
    ):Promise <Order> {
      const order = await super.createOrder(customerId, shippingAddress);
      await orderModel.create(order);
      return order;
    }

    public async view(customerId: Types.ObjectId): Promise<Order> {
        return await super.viewOrder(customerId);
    }
  }