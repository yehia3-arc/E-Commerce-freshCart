// route handler ==> method & api endpoint depend on structure cof folders andd data

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // some logic
  // write queries

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`); // real api
  const data = await res.json();
  return NextResponse.json({
    allBrands: data,
  });
}
