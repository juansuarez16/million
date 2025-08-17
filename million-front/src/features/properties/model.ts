export type PropertyDto = {
    id: string;
    idOwner: string;
    name: string;
    address: string;
    price: number;
    imageUrl: string;
  };
  
  export type PagedResult<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  
  export type PropertyListFilters = {
    name?: string;
    address?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
    sort?: "price" | "-price" | "name" | "-name";
  };
  