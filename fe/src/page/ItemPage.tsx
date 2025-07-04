import { Badge } from "@/components/ui/badge";
import Text from "@/components/common/Text";
import {
  Clock,
  TriangleAlert,
  Circle,
  User,
  MapPin,
  Calendar,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

const item = {
  title: "Silver Watch",
  type: "Lost",
  status: "Open",
  category: "Jewelry",
  location: "Gym",
  date: "3 days ago",
  description:
    "A silver Rolex watch with a metal band. Lost in the locker room at the gym. The watch has a blue face and a date display. There's a small scratch on the glass and the back has an engraving.",
};

const ItemPage = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="aspect-video w-full bg-gray-100 overflow-hidden rounded-lg">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkbTcqDNKzbvGK1gVJ50AFcfrthHdaxxWcwQ&s"
            alt="Silver Watch"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Text className="text-2xl font-semibold">{item.title}</Text>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {item.date}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="red" className="text-xs rounded-2xl px-2 py-0.5">
              <TriangleAlert className="w-3 h-3 mr-1" />
              Lost Item
            </Badge>
            <Badge variant="blue" className="text-xs rounded-2xl px-2 py-0.5">
              <Circle className="w-3 h-3 mr-1" />
              Status: {item.status}
            </Badge>
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-md">
          <h3 className="text-lg font-medium text-[#2D3E50] mb-2">
            Description
          </h3>
          <p className="text-gray-700 text-sm">{item.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard
            title="Category"
            value={item.category}
            icon={<Gem className="h-4 w-4" />}
          />
          <InfoCard
            title="Location"
            value={item.location}
            icon={<MapPin className="h-4 w-4" />}
          />
          <InfoCard
            title="Date"
            value={item.date}
            icon={<Calendar className="h-4 w-4" />}
          />
          <InfoCard
            title="Status"
            value={item.type}
            icon={<TriangleAlert className="h-4 w-4" />}
          />
        </div>

        <div>
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
        </div>
      </div>

      <div className="space-y-5">
        <div className="border p-4 rounded-md">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-gray-500">Member since 2023</p>
            </div>
          </div>

          <div className="mb-3">
            <Text className="text-sm font-medium mb-1">Item Status</Text>
            <Badge
              variant="outline"
              className="text-blue-600 border-blue-300 text-xs rounded-2xl"
            >
              Open
            </Badge>
          </div>

          <div className="space-y-2">
            <Button className="w-full">Claim This Item</Button>
            <Button className="w-full" variant="outline">
              Contact Reporter
            </Button>
            <Button className="w-full" variant="ghost">
              Report Issue
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
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
