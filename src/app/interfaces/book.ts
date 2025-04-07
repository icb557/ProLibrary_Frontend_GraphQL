import { Author } from "./author";

export interface Book {
    isbn: string;
    title: string;
    editorial: string;
    genre: string;
    publicationYear: number;
    authors: Author[],
    __typename?: string
}
