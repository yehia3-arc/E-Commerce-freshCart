import {
  BrandType,
  CategoryType,
  ProductType,
  SubCategoryType,
} from "../types/product.type";

export async function getAllProducts(): Promise<ProductType[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}
export async function getAllProductsinProducts(): Promise<
  ProductType[] | undefined
> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?limit=56`,
      {
        cache: "no-store",
      },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}

export async function getSingleProduct(
  id: string,
): Promise<ProductType | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
      {
        cache: "no-store",
      },
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
      {
        next: { revalidate: 3600 },
      },
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
      next: { revalidate: 3600 },
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
      { next: { revalidate: 3600 } },
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
        cache: "no-store",
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
      { next: { revalidate: 3600 } },
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
        cache: "no-store",
      },
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    return undefined;
  }
}
