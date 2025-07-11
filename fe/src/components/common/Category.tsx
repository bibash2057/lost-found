import {
  Dog,
  Gem,
  Key,
  List,
  Cable,
  Wallet,
  Laptop,
  Grid2x2,
  Smartphone,
  StickyNote,
  BriefcaseBusiness,
} from "lucide-react";
import Text from "./Text";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const category = [
  { name: "All", value: "", icon: List },
  { name: "Bag", value: "Bag", icon: BriefcaseBusiness },
  { name: "Document", value: "Document", icon: StickyNote },
  { name: "Mobile", value: "Mobile", icon: Smartphone },
  { name: "Laptop", value: "Laptop", icon: Laptop },
  { name: "Electronics", value: "Electronics", icon: Cable },
  { name: "Jewelry", value: "Jewelry", icon: Gem },
  { name: "Keys", value: "Keys", icon: Key },
  { name: "Wallet", value: "Wallet", icon: Wallet },
  { name: "Pet", value: "Pet", icon: Dog },
  { name: "Other", value: "Other", icon: Grid2x2 },
];

type categoryProps = {
  setCategory: (category: string) => void;
  categories: string;
};

const Category = ({ setCategory, categories }: categoryProps) => {
  return (
    <div className="space-y-3">
      <Text type="subTitle" className="text-lg font-medium">
        Browse Categories
      </Text>
      <ScrollArea className="w-full">
        <div className="flex space-x-4">
          {category?.map((item, index) => (
            <Button
              key={index}
              onClick={() => setCategory(item?.value)}
              variant="outline"
              className={`${
                categories === item?.value
                  ? "bg-gray-200 border-primary/40"
                  : "border-muted"
              } flex items-center justify-center rounded-3xl px-4 py-3 gap-1  hover:border-primary/40`}
            >
              <item.icon className="md:w-6 w-5 md:h-6 h-5 text-primary/70" />
              <span className="text-[11px] md:text-[13px] font-medium text-muted-foreground">
                {item.name}
              </span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
};

export default Category;
