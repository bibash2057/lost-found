import { toast } from "sonner";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import usePost from "@/hooks/usePost";
import Text from "@/components/common/Text";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/FormInput";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/common/FileUpload";
import { TriangleAlert, HandHeart } from "lucide-react";
import ImportantTips from "@/components/common/ImportantTips";
import ReportOption from "@/components/ReportItem/ReportOption";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Controller, useFieldArray, useForm } from "react-hook-form";

interface VerificationQuestion {
  question: string;
  answer: string;
}

interface ReportItemPayload {
  type: "Lost" | "Found";
  title: string;
  des: string;
  category: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photos: File[];
  verificationQuestions: VerificationQuestion[];
}

const CATEGORY_OPTIONS = [
  "Bag",
  "Document",
  "Mobile",
  "Laptop",
  "Electronics",
  "Jewelry",
  "Keys",
  "Wallet",
  "Pet",
  "Other",
];

const ReportItem = () => {
  const navigate = useNavigate();
  const form = useForm<ReportItemPayload>({
    defaultValues: {
      type: "Lost",
      title: "",
      des: "",
      category: "",
      location: "",
      photos: [],
      verificationQuestions: [{ question: "", answer: "" }],
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "verificationQuestions",
  });

  const { mutate, isPending } = usePost<any, FormData>(
    "/report",
    ["report-item"],
    {
      onSuccess: (res) => {
        console.log("res", res);

        toast.success(res.data.message);
        reset();
        navigate("/");
      },
      onError: (err) => {
        console.log("err", err);
        toast.error("Item Add", {
          description: err.response?.data?.message || "Please try again",
        });
      },
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const onSubmit = async (data: ReportItemPayload) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("title", data.title);
    formData.append("des", data.des);
    formData.append("category", data.category);
    formData.append("location", data.location);

    // formData.append("coordinates[lat]", data.coordinates.lat.toString());
    // formData.append("coordinates[lng]", data.coordinates.lng.toString());

    data.verificationQuestions.forEach((q, idx) => {
      formData.append(`verificationQuestions[${idx}][question]`, q.question);
      formData.append(`verificationQuestions[${idx}][answer]`, q.answer);
    });

    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((file) => {
        formData.append("photos", file);
      });
    }

    console.log("formData", formData);
    mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Text type="subTitle" className="text-lg font-medium mb-4">
            What would you like to report?
          </Text>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReportOption
              name="type"
              control={control}
              value="Lost"
              title="Lost Item"
              description="I lost something"
              icon={<TriangleAlert className="w-6 h-6" />}
            />
            <ReportOption
              name="type"
              control={control}
              value="Found"
              title="Found Item"
              description="I found something"
              icon={<HandHeart className="w-6 h-6" />}
            />
          </div>

          <div className="mt-6">
            <ImportantTips />
          </div>

          <Text type="subTitle" className="text-lg font-medium mb-4">
            Basic Information
          </Text>
          <Separator />

          <FormInput
            name="title"
            label="Item Name *"
            required
            control={control}
            placeholder="e.g. Blue Nike Backpack"
            note="Be specific with brand names if known"
          />

          <FormInput
            name="des"
            label="Description *"
            required
            inputType="textarea"
            control={control}
            placeholder="Describe the item in detail including size, color, brand, unique features..."
            note="Include any distinguishing marks or features"
          />

          <Text type="subTitle" className="text-lg font-medium mb-4">
            Location & Details
          </Text>
          <Separator />

          <div className="flex items-center gap-3">
            <div className="w-full space-y-2.5">
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Text className="text-xs text-gray-500">
                      Be as specific as possible when selecting a category
                    </Text>

                    {fieldState.error && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <FormInput
              name="location"
              label="Location *"
              required
              control={control}
              placeholder="e.g. Tribhuvan International Airport"
              note="Be as specific as possible with the location"
            />
          </div>

          <Text type="subTitle" className="text-lg font-medium mb-4">
            Photos & Verification
          </Text>
          <Separator />
          <FileUpload
            name="photos"
            label="Upload Images"
            control={control}
            required={false}
          />

          {watch("type") === "Found" && (
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
              <Text className="text-sm font-semibold text-purple-800">
                Verification Question
              </Text>
              <Text className="mt-2 space-y-1 text-sm text-purple-700 list-disc list-inside">
                Add a question that only the true owner could answer. This helps
                verify legitimate claims.
              </Text>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="py-3 space-y-2  px-4 rounded-md mt-4 border"
                >
                  <FormInput
                    name={`verificationQuestions.${index}.question`}
                    label={`Security Question ${index + 1} *`}
                    required
                    control={control}
                    placeholder="e.g. What’s the serial number? What’s unique about it?"
                    labelClassName="text-xs"
                    className="bg-white"
                  />
                  <FormInput
                    name={`verificationQuestions.${index}.answer`}
                    label="Correct Answer *"
                    required
                    control={control}
                    placeholder="Enter the answer to your security question"
                    labelClassName="text-xs"
                    className="bg-white"
                  />
                  {index > 0 && (
                    <Button
                      variant="default"
                      type="button"
                      onClick={() => remove(index)}
                      className="text-xs mt-2 bg-red-400"
                    >
                      Remove Question
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                onClick={() => append({ question: "", answer: "" })}
                className="mt-4"
                variant="secondary"
              >
                + Add Another Question
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReportItem;
