import { Separator } from "@radix-ui/react-separator";
import { Bell, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Nav = () => {
  return (
    <nav className="flex h-16 items-center justify-between border-b px-5 py-2 w-full sticky top-0 right-0 left-0 z-50 bg-white">
      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="h-6" />
        {/* <p>Lost and Found</p> */}

        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm font-medium ">
            <span className="">Lost</span>
            <span className="flex items-center justify-center size-5 rounded-sm bg-primary/75 text-xs text-white">
              3
            </span>
          </Button>
          <Button variant="outline" className="text-sm font-medium">
            <span className="">Found</span>
            <span className="flex items-center justify-center size-5 rounded-sm bg-primary/75 text-xs text-white">
              0
            </span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="gap-2">
              <AvatarImage src="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Nav;
