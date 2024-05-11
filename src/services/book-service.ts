import bookModel from "../db/models/books";

import { 
    AvailableBooks, 
    BookProduct, 
} from "./models/book-model";

export class BookService {
    public async addBooks(params: AvailableBooks): Promise<BookProduct> {
        const createdBooks = await bookModel.create({
            author: params.author,
            publisher: params.publisher,
            title: params.title,
            ISBN: params.ISBN,
            genre: params.genre,
            publicationYear: params.publicationYear,
            price: params.price,
            description: params.description
        });
        if(!createdBooks){
            throw new Error ("book not added");
        }
        return createdBooks.toJSON() as BookProduct;
    }

    public async viewBooks(): Promise<BookProduct> {
        try {
            const bookResult = await bookModel.find();
            if(!bookResult){
                throw new Error("no books available found");
            }
            return bookResult as unknown as BookProduct;
        } catch(error) {
            throw error;
        }  
    }
}