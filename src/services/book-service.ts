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
            bookType: params.bookType,
            publicationYear: params.publicationYear,
            price: params.price,
            condition: params.condition
        });
        if(!createdBooks){
            throw new Error ("book not added");
        }
        return createdBooks.toJSON() as BookProduct;
    }

    public async viewAndSearchBooks(bookName?: string): Promise<BookProduct> {
        try {
            let bookResult;
            if(bookName !== ""){
                bookResult = await bookModel.findOne({bookName});
            } else {
                bookResult = await bookModel.find();
            }
            if(!bookResult){
                throw new Error("book not found");
            }
            return bookResult as unknown as BookProduct;
        } catch(error) {
            throw error;
        }  
    }
}