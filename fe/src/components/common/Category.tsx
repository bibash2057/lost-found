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
  { name: "All", icon: List },
  { name: "Bag", icon: BriefcaseBusiness },
  { name: "Document", icon: StickyNote },
  { name: "Mobile", icon: Smartphone },
  { name: "Laptop", icon: Laptop },
  { name: "Electronics", icon: Cable },
  { name: "Jewelry", icon: Gem },
  { name: "Keys", icon: Key },
  { name: "Wallet", icon: Wallet },
  { name: "Pet", icon: Dog },
  { name: "Other", icon: Grid2x2 },
];

const Category = () => {
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
              variant="outline"
              className="flex items-center justify-center rounded-3xl px-4 py-3 gap-1 border-muted hover:border-primary/40"
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
