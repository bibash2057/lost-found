import {
  Tag,
  Hand,
  Circle,
  MapPin,
  Calendar,
  SearchCheck,
  TriangleAlert,
  CircleFadingArrowUp,
} from "lucide-react";
import Text from "./Text";
import Delete from "./Delete";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../ui/card";

const ItemsCard = ({ item, isDelete }: any) => {
  return (
    <Card className="flex md:flex-col flex-row rounded-sm py-0 shadow-none border-gray-50 bg-gray-50/20">
      <div className="h-52 w-full bg-muted/20">
        <img
          src={
            item.photos?.[0] ??
            "https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg"
          }
          alt={item.title || "Photo"}
          className="w-full h-full object-contain"
        />
      </div>
      <CardHeader className="w-full px-2.5 py-8 md:py-1 md:mb-8">
        <Link to={`/${item?._id}`}>
          <CardTitle className="text-lg font-medium leading-snug line-clamp-2 md:h-12">
            {item.title}
          </CardTitle>
        </Link>
        <div className="flex items-center gap-2">
          <Badge
            variant={item.type === "Lost" ? "red" : "purple"}
            className={`text-[11px] px-2 py-0.5 rounded-2xl`}
          >
            {item.type === "Lost" && <TriangleAlert className="h-3 w-3" />}
            {item.type === "Found" && <SearchCheck className="h-3 w-3" />}

            {item.type}
          </Badge>
          <Badge
            variant={
              item.status === "Open"
                ? "blue"
                : item.status === "Claimed"
                ? "green"
                : item.status === "Verifying"
                ? "yellow"
                : "blue"
            }
            className={`text-[11px] px-2 py-0.5 rounded-2xl ${""}`}
          >
            {item.status === "Open" && <Circle className="h-3 w-3" />}
            {item.status === "Claimed" && <Hand className="h-3 w-3" />}
            {item.status === "Verifying" && (
              <CircleFadingArrowUp className="h-3 w-3" />
            )}
            {item.status}
          </Badge>
        </div>

        <div className="space-y-1 pt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="w-4 h-4 shrink-0 " />
            <Text type="p" className="line-clamp-1 text-[13px]">
              {item.category}
            </Text>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0 " />
            <Text type="p" className="line-clamp-1 text-[13px]">
              {item.location}
            </Text>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0 " />
            <Text type="p" className="line-clamp-1 text-[13px] ">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </div>
          {isDelete && (
            <Delete
              title="Are You Sure?"
              description="Do you really want to delete this item"
              url={`/report/${item?._id}`}
              itemKeys={["report-item"]}
              id={item?._id}
            />
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default ItemsCard;
