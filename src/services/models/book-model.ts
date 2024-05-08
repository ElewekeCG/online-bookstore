export interface AvailableBooks {
    author: Types.ObjectId;
    publisher: Types.ObjectId;
    title: string;
    ISBN: string;
    genre: string;
    bookType: string;
    publicationYear: number;
    price: number;
    condition: string;
}

export interface BookProduct {
    id: string;
    author: Types.ObjectId;
    publisher: Types.ObjectId;
    title: string;
    ISBN: string;
    genre: string;
    bookType: string;
    publicationYear: number;
    price: number;
    condition: string;
}

import { Types } from "mongoose";

// export interface AuthorParams {
//     firstName: string;
//     lastName: string;
//     book: Types.ObjectId;
// }

// export interface Author{
//     id: Types.ObjectId;
//     firstName: string;
//     lastName: string;
//     book: Types.ObjectId;
// }

// export interface PublisherParams {
//     name: string;
//     country: string;
//     book: Types.ObjectId;
// }

export interface Publisher {
    id: Types.ObjectId;
    name: string;
    country: string;
    book: Types.ObjectId;
}