import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import usePost from "@/hooks/usePost";
import { useAuth } from "@/store/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

type LoginFormValue = {
  phone: string;
  password: string;
};

type LoginApiResponse = {
  token: string;
};

const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number can't exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const { control, handleSubmit } = form;

  const { mutate } = usePost<LoginApiResponse, LoginFormValue>(
    "/login",
    ["login"],
    {
      onSuccess: (res) => {
        console.log("res", res);
        const token = res.data.token;
        loginUser(token, null);
        toast.success("Logged in successfully!");

        navigate("/");
      },
      onError: (err) => {
        console.log("err", err);
        toast.error("Login failed", {
          description: err.response?.data?.message || "Please try again",
        });
      },
    }
  );

  const onSubmit = (data: LoginFormValue) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col w-full max-w-md p-5">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to your Acme Inc account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-7 py-5 md:px-4 w-full"
            >
              <FormInput
                name="phone"
                control={control}
                label="Phone Number"
                placeholder="Enter a phone number"
                type="number"
              />
              <FormInput
                name="password"
                control={control}
                label="Password"
                placeholder="Enter a Password"
                type="password"
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
