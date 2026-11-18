import {
  BrandType,
  CategoryType,
  ProductType,
  SubCategoryType,
} from "../types/product.type";

export async function getAllProducts(): Promise<ProductType[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`, {
      cache: "force-cache",
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}
// export async function getAllProductsForSearch(): Promise<
//   ProductType[] | undefined
// > {
//   try {
//     const limit = 50;
//     let page = 1;
//     let total = Infinity;
//     let all: ProductType[] = [];

//     while (all.length < total) {
//       const res = await fetch(
//         `https://ecommerce.routemisr.com/api/v1/products?page=${page}&limit=${limit}`,
//         { cache: "force-cache" },
//       );
//       const data = await res.json();
//       total = data.results ?? 0; // total product count from the API
//       const list: ProductType[] = data.data ?? [];
//       if (!list.length) break;
//       all = all.concat(list);
//       page++;
//     }
//     return all;
//   } catch (err) {
//     return undefined;
//   }
// }
export async function getSingleProduct(
  id: string,
): Promise<ProductType | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
    );
    const data = await res.json();
    console.log("dataaaaa", data.data);
    return data.data;
  } catch (err) {
    return undefined;
  }
}
export async function getAllCategory(): Promise<CategoryType[] | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories`,
    );
    const data = await res.json();
    //console.log("dataaaa", data.data);
    return data.data;
  } catch (err) {
    return undefined;
  }
}
export async function getAllBrands(): Promise<BrandType[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`, {
      cache: "force-cache",
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}

export async function getSingleBrand(
  id: string,
): Promise<BrandType | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${id}`,
      { cache: "force-cache" },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}

// export async function getProductsByBrand(
//   id: string,
// ): Promise<ProductType[] | undefined> {
//   try {
//     const res = await fetch(
//       `https://ecommerce.routemisr.com/api/v1/products?brand=${id}&limit=50`,
//       { cache: "force-cache" },
//     );
//     const data = await res.json();
//     return data.data;
//   } catch (err) {
//     return undefined;
//   }
// }

export async function getAllSubCategory(
  id: string,
): Promise<SubCategoryType[] | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`,
      {
        cache: "force-cache",
      },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}
export async function getProductsByCategory(
  id: string,
): Promise<CategoryType | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}`,
      { cache: "force-cache" },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}
export async function getSpecificSubCategory(
  id: string,
): Promise<SubCategoryType | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/subcategories/${id}`,
      {
        cache: "force-cache",
      },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}
