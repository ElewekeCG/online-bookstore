import { InventoryFacade } from "./inventory-service";
import { CartService, CartItem } from "./cart-service";
import orderModel from "../db/models/orders";
import { Types } from "mongoose";

interface Order {
    orderDate: Date;
    subtotal: number;
    shippingAddress: string;
    bookOrdered: CartItem[]; // Array of ordered books (avoid reference to cart schema)
}

export class OrderFactory {
    private readonly cartService: CartService;
    private readonly inventory: InventoryFacade;

    constructor(
        cartService: CartService, 
        inventory: InventoryFacade
    ) {
        this.cartService = cartService;
        this.inventory = inventory;
    }

    public async createOrder(
        customerId: string, 
        shippingAddress: string
    ): Promise<Order> {
        const cartItems = await this.cartService.viewCart(customerId);
        const itemsForAvailabilityCheck = cartItems.map((item: { bookId: Types.ObjectId; quantity: number; }) => ({
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
}

export class OrderService {
    private readonly orderFactory: OrderFactory;

    constructor(orderFactory: OrderFactory) {
        this.orderFactory = orderFactory;
    }

    public async createOrder(
        customerId: string,
        shippingAddress: string
    ):Promise <Order> {
      const order = await this.orderFactory.createOrder(customerId, shippingAddress);
      await orderModel.create(order);
      return order;
    }
  }