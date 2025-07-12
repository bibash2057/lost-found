import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/store/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Nav = () => {
  const { logOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex h-16 items-center justify-between border-b px-5 py-2 w-full sticky top-0 right-0 left-0 z-50 bg-white">
      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="h-6" />
        <Link to={"/"}>
          <p>Lost and Found </p>
        </Link>
        <span>\</span>
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Link to={"/reportItem"}>
            <Button variant={"outline"}>Report Item</Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="gap-2">
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem>Profile</DropdownMenuItem>

              <DropdownMenuItem>
                <Link to={"/myReport"}>Reported Items</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logOut();
                  toast.success("Logout successfully!");
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to={"/login"}>
            <Button variant={"ghost"}>Login</Button>
          </Link>
          <Link to={"/register"}>
            <Button>SignUp</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
