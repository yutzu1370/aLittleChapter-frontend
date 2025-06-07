export type Book = {
    id: number;
    title: string;
    author: string;
    publisher: string;
    imageUrl: string;
    categoryName: string;
    ageRangeName: string;
    price: number;
    discountPrice: number | null;
    isNewArrival: boolean;
    isBestseller: boolean;
    introductionHtml: string;
    quantity: number;
    stockQuantity: number;
  };

  export type BooksResponse = {
    status: boolean;
    data: {
      title: string;
      books: Book[];
    };
  };