import { format, subDays } from "date-fns";
import { NextRequest } from "next/server";
import { dataSchema, extendedDataSchema } from "../../shema";

const DEMO_DATA_URL =
  "https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json";

// Cache for the demo data to avoid repeated fetches
let cachedData: any[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchDemoData() {
  // Check if we have valid cached data
  if (
    cachedData &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedData;
  }

  try {
    const response = await fetch(DEMO_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch demo data: ${response.statusText}`);
    }

    const data = await response.json();
    cachedData = data;
    cacheTimestamp = Date.now();
    return data;
  } catch (error) {
    console.error("Error fetching demo data:", error);
    // Return empty array if fetch fails
    return [];
  }
}

function transformDemoData(
  rawData: any[],
  page: number = 0,
  pageSize: number = 50,
): any[] {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = rawData.slice(startIndex, endIndex);

  return pageData.map((item, index) => {
    // Parse the demo data and add additional fields
    const parsed = dataSchema.parse(item);

    // Generate additional fields for the table
    const states = ["LA", "MN", "PA", "KY", "RI", "CA", "NY", "TX", "FL", "IL"];
    const randomState = states[Math.floor(Math.random() * states.length)];

    // Generate a random created date within the last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const createdDate = subDays(new Date(), randomDaysAgo);

    // Generate primary field (random boolean)
    const isPrimary = Math.random() < 0.3; // 30% chance of being primary

    // Create unique ID by combining original ID with timestamp using date-fns
    const timestamp = format(new Date(), "yyyyMMddHHmmssSSS");
    const uniqueId = `${parsed.id}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

    return extendedDataSchema.parse({
      ...parsed,
      id: uniqueId, // Use unique ID
      primary: isPrimary,
      state: randomState,
      createdDate: createdDate,
    });
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const search = searchParams.get("search") || "";

    // Fetch the demo data
    const rawData = await fetchDemoData();

    // Transform the data
    const transformedData = transformDemoData(rawData, page, pageSize);

    // Apply search filter if provided
    const filteredData = search
      ? transformedData.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.language.toLowerCase().includes(search.toLowerCase()) ||
            item.bio.toLowerCase().includes(search.toLowerCase()),
        )
      : transformedData;

    // Calculate pagination info
    const totalItems = rawData.length;
    const hasNextPage = (page + 1) * pageSize < totalItems;
    const hasPrevPage = page > 0;

    return Response.json({
      data: filteredData,
      pagination: {
        page,
        pageSize,
        totalItems,
        hasNextPage,
        hasPrevPage,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      meta: {
        totalRowCount: totalItems,
        filterRowCount: filteredData.length,
        chartData: [], // No chart data for demo
        facets: {}, // No facets for demo
        metadata: {},
      },
    });
  } catch (error) {
    console.error("Error in demo API route:", error);
    return Response.json(
      { error: "Failed to fetch demo data" },
      { status: 500 },
    );
  }
}
