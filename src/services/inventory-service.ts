import inventoryModel from "../db/models/inventory";
import { CartItem } from "./cart-service";

export class InventoryFacade {
    private inventoryService = new InventoryService();
    public async checkAvailability(items: CartItem[]): Promise<boolean> {
        return this.inventoryService.checkAvailability(items);
    }

    public async updateInventory(newInventory: InventoryItem[]): Promise<void> {
        return this.inventoryService.updateInventory(newInventory);
    }
}

interface InventoryItem {
    bookId: string;
    quantity: number;
}

class InventoryService {
    public async checkAvailability(items: CartItem[]): Promise<boolean> {
        // convert bookId from each cart item into an array of bookIds
        const bookIds = items.map((item) => item.bookId);

        const pipeline = [
            {
                /* using the lookup function to join the inventoryModel with the books schema based
                on the bookId. the result would be an array named bookData with information about each book
                */
                $lookup: {
                    from: 'Books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'bookData'
                }
            },
            {
                /* 
                unwind the result from the lookup which would be seperate documents
                */
                $unwind: '$bookData'
            },
            {
                /* filters the document based on two criteria: first check if _id in the inventory matches any bookId from the carts item
                then checks if the quantity is >= the requested quantity
                 */
                $match: {
                    $and: [
                        { _id: { $in: bookIds } }, //check if bookId matches requested items
                        { 'bookData.quantity': { $gte: '$quantity' } } //check if bokk quantity >= requested quantity
                    ]
                }
            },
            {
                //group result
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];

        const availableBooks = await inventoryModel.aggregate(pipeline);

        // check if number of books found = number of items in the cart
        return availableBooks.length > 0 && availableBooks[0].count === items.length;
    }

    public async updateInventory(newInventory: InventoryItem[]): Promise<void> {
        try {
            // iterate over each inventory item
            for (const item of newInventory) {
                const existingItem = await inventoryModel.findOne({bookId: item.bookId});
                if(existingItem) {
                    // if item exists
                    existingItem.quantity = item.quantity;
                    await existingItem.save();
                } else {
                    // if item does not exist
                    await inventoryModel.create(item);
                }
            }
        } catch(error) {
            throw new Error(`Failed to update inventory: $error.message`);
        }
    }
}