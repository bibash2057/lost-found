import Text from "@/components/common/Text";
import { Button } from "@/components/ui/button";
import Category from "@/components/common/Category";
import ItemsCard from "@/components/common/ItemsCard";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/useFetch";

const items = [
  {
    type: "Lost",
    title: "Blue Backpack",
    category: "Bag",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRncH8yjqwUyXxTnEeyDnyntczNrtFFRWmwdQ&s",
    location: "University Cafeteria",
    date: "2025-07-03",
    status: "Open",
  },
  {
    type: "Found",
    title: "iPhone 15 Pro",
    category: "Mobile",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkbTcqDNKzbvGK1gVJ50AFcfrthHdaxxWcwQ&s",
    location: "Thamel Street Market",
    date: "2025-07-02",
    status: "Claimed",
  },
  {
    type: "Lost",
    title: "House Keys (on a red lanyard)",
    category: "Keys",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvi_YhXfwuqQyUpniOQ0GBrt3kZOUu5ITVbQ&s",
    location: "Boudhanath Stupa Grounds",
    date: "2025-07-04",
    status: "Verifying",
  },
  {
    type: "Found",
    title: "Black Leather Wallet",
    category: "Wallet",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnOdohoHbu3-fy7RKdI8MmrytDJdkcOnkCIw&s",
    location: "Durbar Square (near ticket counter)",
    date: "2025-07-01",
    status: "Claimed",
  },
  {
    type: "Lost",
    title: "Passport (Nepali)",
    category: "Document",
    photos: "https://u-mercari-images.mercdn.net/photos/m61952756735_1.jpg",
    location: "Kathmandu Airport (T.I.A) Departure Lounge",
    date: "2025-06-29",
    status: "Resolved",
  },
  {
    type: "Found",
    title: "Silver Watch (Rolex)",
    category: "Jewelry",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCF-iCGbjQ0-0XT3YrPn6AGiDZiwcs-l50Ag&s",
    location: "Fitness Center, Lazimpat",
    date: "2025-07-03",
    status: "Claimed",
  },
  {
    type: "Found",
    title: "Small Dog - Beagle Mix",
    category: "Pet",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB_c6LlOHlPuwE2Hd3z2ip_Duox17yHf7gwQ&s",
    location: "Patan Durbar Square Park",
    date: "2025-07-01",
    status: "Open",
  },
  {
    type: "Lost",
    title: "Laptop Charger (MacBook Pro)",
    category: "Electronics",
    photos:
      "https://images.jdmagicbox.com/quickquotes/images_main/honda-radeon-goldan-bike-key-material-abs-plastic-2221475889-ln3wt8lg.jpg",
    location: "Shared Workspace, Tripureshwor",
    date: "2025-07-04",
    status: "Claimed",
  },
  {
    type: "Found",
    title: "Eyeglasses (Ray-Ban, black frame)",
    category: "Other",
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzDNPxAlx7o9I7OTXkEy8YxvUXvx9A9TpuQ&s",
    location: "Bus Stop, Ratna Park",
    date: "2025-07-02",
    status: "Claimed",
  },
  {
    type: "Lost",
    title: "Red Umbrella",
    category: "Other",
    photos:
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
    location: "Near local grocery store, New Baneshwor",
    date: "2025-07-03",
    status: "Verifying",
  },
];

const HomePage = () => {
  const { data, isFetching, error } = useFetch("/report", ["report-item"]);
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
            type="text"
            placeholder="Search for items (e.g. 'black wallet', 'iphone')"
            className=" outline-none text-gray-700 placeholder-gray-400 bg-transparent w-full"
          />
        </div>
      </div>

      <Category />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text type="subTitle" className="text-lg font-medium">
            Recently Reported
          </Text>
          <span>
            <Button
              variant="ghost"
              className="text-primary text-sm font-medium"
            >
              View All
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
          {data?.data?.map((item: any) => (
            <ItemsCard item={item} key={item?._id} />
          ))}
        </div>
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
