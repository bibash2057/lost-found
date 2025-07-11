import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import usePost from "@/hooks/usePost";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";

const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate } = usePost<any>("/register", ["register"], {
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
  });

  const onSubmit = (data: any) => {
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
                name="name"
                control={control}
                label="Full Name"
                placeholder="Enter your name"
              />
              <FormInput
                name="email"
                control={control}
                label="Email"
                placeholder="Enter your email"
                type="email"
              />
              <FormInput
                name="phone"
                control={control}
                label="Phone Number"
                placeholder="Enter your phone number"
              />
              <FormInput
                name="password"
                control={control}
                label="Password"
                placeholder="Enter your password"
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

export default RegisterPage;
