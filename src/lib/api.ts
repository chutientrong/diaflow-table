import { DataItem, ApiResponse } from "@/types/data";

const API_BASE_URL = "https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json";

// Cache for the data to avoid repeated fetches
let cachedData: DataItem[] | null = null;

export async function fetchAllData(): Promise<DataItem[]> {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    
    // Transform the data to add unique IDs and additional fields
    const transformedData: DataItem[] = rawData.map((item: any, index: number) => ({
      id: `${item.id || 'item'}-${index}`,
      name: item.name || `User ${index + 1}`,
      email: item.email || `user${index + 1}@example.com`,
      bio: item.bio || `Address ${index + 1}`,
      language: item.language || 'English',
      version: item.version || Math.floor(Math.random() * 10) + 1,
      state: item.state || ['CA', 'NY', 'TX', 'FL', 'IL'][Math.floor(Math.random() * 5)],
      createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    cachedData = transformedData;
    return transformedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function fetchPaginatedData(
  page: number = 0,
  pageSize: number = 50
): Promise<ApiResponse> {
  const allData = await fetchAllData();
  
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = allData.slice(startIndex, endIndex);
  
  const totalItems = allData.length;
  const hasNextPage = endIndex < totalItems;
  const hasPrevPage = page > 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    data: pageData,
    pagination: {
      page,
      pageSize,
      totalItems,
      hasNextPage,
      hasPrevPage,
      totalPages,
    },
  };
}


