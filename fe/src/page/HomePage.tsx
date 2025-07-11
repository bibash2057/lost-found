import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useFetch from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import Text from "@/components/common/Text";
import { Button } from "@/components/ui/button";
import Category from "@/components/common/Category";
import useDebounce from "@/hooks/usedeDouncedSearch";
import ItemsCard from "@/components/common/ItemsCard";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

const HomePage = () => {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebounce({ value: search, delay: 500 });

  const { data, isFetching, error } = useFetch(
    `/report?search=${debouncedSearch}&category=${category}&status=${status}&type=${type}`,
    ["report-item", debouncedSearch, category, status, type]
  );
  console.log("data", data);

  if (isFetching) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    return <div>Error loading reports: {error.message}</div>;
  }

  return (
    <div className="py-3 space-y-6 relative">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center w-full md:w-1/2 gap-3 border border-gray-200 rounded-full px-3 py-2  bg-custom-gray focus-within:border-gray-300 transition-all">
          <Search className="text-gray-500 size-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search for items (e.g. 'black wallet', 'iphone')"
            className=" outline-none text-gray-700 placeholder-gray-400 bg-transparent w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="border p-2 rounded-lg">
            <SlidersHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["Open", "Verifying", "Claimed"].map((stat) => (
              <DropdownMenuItem
                key={stat}
                onClick={() => setStatus(stat === status ? "" : stat)}
                className={
                  stat === status
                    ? "font-semibold text-primary bg-gray-100"
                    : ""
                }
              >
                {stat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Category setCategory={setCategory} categories={category} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text type="subTitle" className="text-lg font-medium">
            Recently Reported
          </Text>
          <span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setType("")}
                variant="ghost"
                className="text-primary text-sm font-medium"
              >
                View All
              </Button>
              <Button
                onClick={() => setType("Lost")}
                variant="outline"
                className={`text-sm font-medium ${
                  type === "Lost" ? "bg-gray-200 border-primary/40" : ""
                }`}
              >
                <span className="">Lost</span>
                <span className="flex items-center justify-center size-5 rounded-sm bg-primary/75 text-xs text-white">
                  3
                </span>
              </Button>
              <Button
                onClick={() => setType("Found")}
                variant="outline"
                className={`text-sm font-medium ${
                  type === "Found" ? "bg-gray-200 border-primary/40" : ""
                }`}
              >
                <span className="">Found</span>
                <span className="flex items-center justify-center size-5 rounded-sm bg-primary/75 text-xs text-white">
                  0
                </span>
              </Button>
            </div>
          </span>
        </div>

        {data?.data?.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-10">
            <p className="text-lg font-semibold">No reported items found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {data?.data?.map((item: any) => (
              <ItemsCard item={item} key={item?._id} />
            ))}
          </div>
        )}
      </div>
      <Link to={"/reportItem"}>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-5 z-50 rounded-md shadow-lg bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
};

export default HomePage;
