// importing the inventory schema model
import inventoryModel from "../db/models/inventory";
import { Types } from "mongoose";

// the inventory facade class creates an instance of the inventory service which is then used 
// by the client
export class InventoryFacade {
    // creating an instance of the inventory service class
    private inventoryService = new InventoryService();

    // calling the update method from inventory service class
    public async updateInventory(book: string, quantity: number): Promise<InventoryItem> {
        return await this.inventoryService.updateInventory(book, quantity);
    }

    public async updateQuantityAfterOrder(books: {bookId: Types.ObjectId, quantity: number, price: number}[]): Promise<{bookId: Types.ObjectId, quantity: number, price: number}[]> {
        return await this.inventoryService.updateQuantityAfterOrder(books);
    }
    // calling the view method from the inventory service class
    public async viewInventory(book: string): Promise<InventoryItem> {
        return await this.inventoryService.viewInventory(book);
    }
}

// degining an interface that specifies the required return value
export interface InventoryItem {
    book: string;
    quantity: number;
}

// inventory service class with all the actual implementation
class InventoryService {
    // update inventory method, returns a promise of type inventory item
    public async updateInventory(book: string, quantity: number): Promise<InventoryItem> {
        try {
            // query the inventory schema to find a book
            const inventoryExists = await inventoryModel.findOne({book});
            // if the book exists
            if(inventoryExists){
                // update the book quantity
                inventoryExists.quantity += quantity;
                // save the update
                await inventoryExists.save();
                // return the updated inventory in JSON format
                return inventoryExists.toJSON() as InventoryItem;
            }
            // if no matching book exists, create a new inventory
            const newInventory = await inventoryModel.create({book, quantity});
            // if creation fails
            if(!newInventory){
                throw new Error("failed to create new inventory");
            }
            // if creation is successful, return the created item in JSON format
            return newInventory.toJSON() as InventoryItem;
        } catch(error) {
            throw error;
        }
    }

    // updating the number of items in stock after a successful order
    public async updateQuantityAfterOrder(books: {bookId: Types.ObjectId, quantity: number, price: number}[]): Promise<{bookId:Types.ObjectId, quantity: number, price: number}[]> {
        // creating empty arrays to store available books and error messages
        const updatedItems = [];
        const errorMessages = [];

        // iterating over each book
        for(const {bookId, quantity, price } of books) {
            try {
                // querying the inventory schema to verify availability
                const currentQuantity = await inventoryModel.findOneAndUpdate({bookId});
                // if a book is not found, add the error message to the error message array and continue the iteration
                if(!currentQuantity) {
                    errorMessages.push(`book id: ${bookId} not found`);
                    continue;
                }
                // if the available quantity is less than the required quantity, add the error to the array and continue
                if(currentQuantity.quantity < quantity) {
                    errorMessages.push(`insufficient book: ${bookId} `);
                    continue;
                }
                // if book is found, and has enough in stock for the order, update the quantity
                currentQuantity.quantity -= quantity;
                // save the new quantity in the database
                await currentQuantity.save();
                // add available books to the updatedItems array
                updatedItems.push({bookId, quantity, price});
            } catch(error) {
                errorMessages.push(`error updating book: ${bookId}`);
                console.error(error);
            }
        }
        // if there are error messages, log them and throw them
        if(errorMessages.length > 0) {
            console.error(errorMessages)
            throw new Error(`some items are out of stock`);
        }
        // else, return an array of available items
        return updatedItems;
    }

    // method to check for books in inventory
    public async viewInventory(book: string):Promise<InventoryItem> {
        try {
            // query the inventory schema for a book
            const inventoryStatus = await inventoryModel.findOne({book});
            // if bokk does not exist, throw an error
            if(!inventoryStatus){
                throw new Error("no items available");
            }
            // if book exists, return the book and quantity
            return inventoryStatus as unknown as InventoryItem;
        } catch(error) {
            throw error;
        }
    }
}