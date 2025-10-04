import fs from "fs";
import path from "path";
import { subDays } from "date-fns";
import { NextRequest } from "next/server";
import { dataSchema, extendedDataSchema } from "../../shema";

// Cache for the local data to avoid repeated file reads
let cachedData: any[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function loadLocalData() {
  // Check if we have valid cached data
  if (
    cachedData &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedData;
  }

  try {
    const filePath = path.join(process.cwd(), "src/datas/5MB.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    cachedData = data;
    cacheTimestamp = Date.now();
    return data;
  } catch (error) {
    console.error("Error loading local data:", error);
    // Return empty array if file read fails
    return [];
  }
}

function transformDemoData(
  rawData: any[],
  page: number = 0,
  pageSize: number = 20,
): any[] {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = rawData.slice(startIndex, endIndex);

  return pageData.map((item, index) => {
    // Parse the demo data and add additional fields
    const parsed = dataSchema.parse(item);

    // Generate unique ID by combining original ID with page and index
    const uniqueId = `${parsed.id}-${page}-${index}`;

    // Generate additional fields for the table
    const states = ["LA", "MN", "PA", "KY", "RI", "CA", "NY", "TX", "FL", "IL"];
    const randomState = states[Math.floor(Math.random() * states.length)];

    // Generate a random created date within the last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const createdDate = subDays(new Date(), randomDaysAgo);

    // Generate primary field (random boolean)
    const isPrimary = Math.random() < 0.3; // 30% chance of being primary

    return extendedDataSchema.parse({
      ...parsed,
      id: uniqueId, // Use unique ID
      primary: isPrimary,
      state: randomState,
      createdDate: createdDate,
    });
  });
}

function searchData(data: any[], searchTerm: string): any[] {
  if (!searchTerm || searchTerm.trim() === "") return data;

  const lowercaseSearch = searchTerm.toLowerCase().trim();

  return data.filter((item) => {
    // Search in multiple fields
    const searchableFields = [
      item.name?.toLowerCase() || "",
      item.language?.toLowerCase() || "",
      item.bio?.toLowerCase() || "",
      item.id?.toLowerCase() || "",
      item.state?.toLowerCase() || "",
    ];

    // Check if any field contains the search term
    return searchableFields.some((field) => field.includes(lowercaseSearch));
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    console.log("API route called");
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const search = searchParams.get("search") || "";
    console.log("Params:", { page, pageSize, search });

    // Load the local data
    const rawData = await loadLocalData();
    console.log("Raw data length:", rawData.length);

    // Apply search filter first
    const filteredData = searchData(rawData, search);
    console.log("Filtered data length:", filteredData.length);

    // Transform the data with pagination
    const transformedData = transformDemoData(filteredData, page, pageSize);
    console.log("Transformed data length:", transformedData.length);

    // Calculate pagination info
    const totalItems = filteredData.length;
    const hasNextPage = (page + 1) * pageSize < totalItems;
    const hasPrevPage = page > 0;

    return Response.json({
      data: transformedData,
      pagination: {
        page,
        pageSize,
        totalItems,
        hasNextPage,
        hasPrevPage,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      meta: {
        totalRowCount: rawData.length,
        filterRowCount: filteredData.length,
        chartData: [], // No chart data for demo
        facets: {}, // No facets for demo
        metadata: {},
      },
    });
  } catch (error) {
    console.error("Error in local API route:", error);
    return Response.json(
      { error: "Failed to fetch local data" },
      { status: 500 },
    );
  }
}
