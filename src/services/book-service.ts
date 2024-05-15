// importing the book schema model
import bookModel from "../db/models/books";

// importing the interfaces created in /service/model/book-model.ts
import { 
    // specifies the request parameters
    AvailableBooks, 
    // specifies the response body
    BookProduct, 
} from "./models/book-model";

// book service contains all the book operations
export class BookService {
    public async addBooks(params: AvailableBooks): Promise<BookProduct> {
        // creating the new book in the schema
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
        // returning the created book
        return createdBooks.toJSON() as BookProduct;
    }

    // method to retrieve all books stored in the schema
    public async viewBooks(): Promise<BookProduct> {
        try {
            // querying the bookmodel 
            const bookResult = await bookModel.find();
            if(!bookResult){
                throw new Error("no books available found");
            }
            // returning available books 
            return bookResult as unknown as BookProduct;
        } catch(error) {
            throw error;
        }  
    }
}