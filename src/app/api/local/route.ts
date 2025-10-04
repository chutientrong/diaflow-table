import { NextRequest, NextResponse } from "next/server";
import type { InfiniteQueryResponse } from "../../query-options";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const search = searchParams.get("search") || "";

    console.log("API: Fetching data with params:", { page, pageSize, search });

    // Generate mock data
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const totalItems = 1000; // Total mock items

    const mockData = Array.from({ length: pageSize }, (_, i) => {
      const index = startIndex + i;
      return {
        id: `item-${index}`,
        name: search ? `Search Result ${index}` : `Item ${index}`,
        bio: `Bio for item ${index}`,
        language: ["JavaScript", "TypeScript", "Python", "Go", "Rust"][index % 5],
        version: Math.floor(Math.random() * 10) + 1,
        state: ["active", "inactive", "pending"][index % 3],
        createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        primary: index % 2 === 0,
      };
    });

    const response: InfiniteQueryResponse = {
      data: mockData,
      pagination: {
        page,
        pageSize,
        totalItems,
        hasNextPage: endIndex < totalItems,
        hasPrevPage: page > 0,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      meta: {
        totalRowCount: totalItems,
        filterRowCount: search ? Math.floor(totalItems * 0.7) : totalItems,
        chartData: [],
        facets: {},
        metadata: {},
      },
    };

    console.log("API: Returning response:", {
      dataLength: response.data.length,
      pagination: response.pagination,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}