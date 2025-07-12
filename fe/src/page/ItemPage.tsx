import {
  Gem,
  Hand,
  User,
  Clock,
  Circle,
  MapPin,
  Calendar,
  SearchCheck,
  TriangleAlert,
  CircleFadingArrowUp,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import Text from "@/components/common/Text";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import ClaimItem from "@/components/ClaimItem";
import { useAuth } from "@/store/useAuth";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { AxiosError } from "axios";
import MapView from "./MapView";

const ItemPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { userInfo } = useAuth();

  const { data, isFetching, error } = useFetch(`/report/${id}`, [
    "report",
    `${id}`,
  ]);
  console.log("data", data);

  const isOwner = userInfo?._id === data?.data?.postedBy?._id;

  if (isFetching) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return (
      <div>
        Error loading reports:{" "}
        {axiosError.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6 order-2 md:order-1">
        <>
          {" "}
          <div className="aspect-video w-full bg-gray-100 overflow-hidden rounded-lg">
            <img
              src={
                data?.data.photos?.[selectedImage] ||
                "https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg"
              }
              alt={data?.data.photos?.[selectedImage]}
              className="w-full h-full object-contain object-center"
            />
          </div>
          <div className="w-full h-28 rounded-md border">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-4 p-4">
                {data?.data?.photos?.map((photo: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-30 flex-shrink-0 rounded-md border-2 cursor-pointer ${
                      selectedImage === index
                        ? "border-primary/40"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Text className="text-2xl font-semibold">
                {data?.data?.title}
              </Text>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(data?.data?.createdAt).toDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={data?.data.type === "Lost" ? "red" : "purple"}
                className={`text-[11px] px-2 py-0.5 rounded-2xl`}
              >
                {data?.data.type === "Lost" && (
                  <TriangleAlert className="h-3 w-3" />
                )}
                {data?.data.type === "Found" && (
                  <SearchCheck className="h-3 w-3" />
                )}

                {data?.data.type}
              </Badge>

              <Badge
                variant={
                  data?.data?.status === "Open"
                    ? "blue"
                    : data?.data?.status === "Claimed"
                    ? "green"
                    : data?.data?.status === "Verifying"
                    ? "yellow"
                    : "blue"
                }
                className={`text-[11px] px-2 py-0.5 rounded-2xl ${""}`}
              >
                {data?.data?.status === "Open" && (
                  <Circle className="h-3 w-3" />
                )}
                {data?.data?.status === "Claimed" && (
                  <Hand className="h-3 w-3" />
                )}
                {data?.data?.status === "Verifying" && (
                  <CircleFadingArrowUp className="h-3 w-3" />
                )}
                {data?.data?.status}
              </Badge>
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-md">
            <h3 className="text-lg font-medium text-[#2D3E50] mb-2">
              Description
            </h3>
            <p className="text-gray-700 text-sm">{data?.data?.des}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard
              title="Category"
              value={data?.data?.category}
              icon={<Gem className="h-4 w-4" />}
            />
            <InfoCard
              title="Location"
              value={data?.data?.location}
              icon={<MapPin className="h-4 w-4" />}
            />
            <InfoCard
              title="Date"
              value={new Date(data?.data?.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                }
              )}
              icon={<Calendar className="h-4 w-4" />}
            />
            <InfoCard
              title="Status"
              value={data?.data?.type}
              icon={<TriangleAlert className="h-4 w-4" />}
            />
          </div>
          {data?.data?.coordinates && (
            <>
              <Text type="caption">
                The map below shows the reported location where the item was
                found.
              </Text>
              <MapView position={data.data.coordinates} />
            </>
          )}
          {/* <div>
          <h3 className="text-lg font-semibold mb-3">Comments (3)</h3>
          <div className="space-y-4">
            <Comment
              name="User A"
              time="2 hours ago"
              text="Saw it near cafe."
            />
            <Comment
              name="User B"
              time="1 hour ago"
              text="Is it a dark blue or light blue backpack?"
            />
            <Comment
              name="User C"
              time="30 minutes ago"
              text="I think I might have seen something similar yesterday."
            />
          </div>

          <div className="mt-4 flex gap-2 items-center">
            <input
              placeholder="Add a comment..."
              className="flex-1 border rounded-md px-4 py-2 text-sm"
            />
            <Button size="sm">Post Comment</Button>
          </div>
        </div> */}
        </>
      </div>

      <div className="space-y-5 order-1 md:order-2">
        <div className="border p-4 rounded-md order-1">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-semibold">
                {data?.data?.postedBy?.name}
              </p>
              {/* <p className="text-xs text-gray-500">Member since 2023</p> */}
            </div>
          </div>

          <div className="mb-3">
            <Text className="text-sm font-medium mb-1">Item Status</Text>
            <Badge
              variant={
                data?.data?.status === "Open"
                  ? "blue"
                  : data?.data?.status === "Claimed"
                  ? "green"
                  : data?.data?.status === "Verifying"
                  ? "yellow"
                  : "blue"
              }
              className={`text-[11px] px-2 py-0.5 rounded-2xl ${""}`}
            >
              {data?.data?.status === "Open" && <Circle className="h-3 w-3" />}
              {data?.data?.status === "Claimed" && <Hand className="h-3 w-3" />}
              {data?.data?.status === "Verifying" && (
                <CircleFadingArrowUp className="h-3 w-3" />
              )}
              {data?.data?.status}
            </Badge>
          </div>

          {data?.data?.status === "Claimed" && (
            <div className="space-y-2 rounded-md border p-4  bg-muted/40">
              <div className="flex items-center gap-2">
                <Text type="description">Claimed By:</Text>
                <Text type="caption">
                  {data?.data?.claimedBy?.userId?.name}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Text type="description">Claimed At:</Text>
                <Text type="caption">
                  {new Date(
                    data?.data?.claimedBy?.claimedAt
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {data?.data?.status === "Claimed" ? (
              <></>
            ) : (
              <>
                {data?.data?.type === "Lost" ? (
                  <Button className="w-full">Report Found</Button>
                ) : (
                  <ClaimItem item={data?.data} disabled={isOwner} />
                )}
                <Button className="w-full" variant="outline">
                  Contact Reporter
                </Button>
                <Button className="w-full" variant="ghost">
                  Report Issue
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 order-3 md:order-2">
          <Text className="font-semibold mb-1">Similar Items</Text>
          <p className="text-xs text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) => (
  <div className="border rounded-md p-4 bg-white">
    <p className="text-xs text-gray-500 mb-1">{title}</p>
    <span className="flex items-center gap-2">
      {icon}
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </span>
  </div>
);

const Comment = ({
  name,
  time,
  text,
}: {
  name: string;
  time: string;
  text: string;
}) => (
  <div className="border rounded-md p-3 bg-white shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
    <p className="text-sm text-gray-700">{text}</p>
  </div>
);

export default ItemPage;
