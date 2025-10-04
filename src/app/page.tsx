import { getQueryClient } from "@/providers/get-query-client";
import { Client } from "./client";
import { dataOptions } from "./query-options";
import { searchParamsCache } from "./search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const search = searchParamsCache.parse(await searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(dataOptions(search));

  return (
    <div className="px-10">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <Client />
    </div>
  )
}
