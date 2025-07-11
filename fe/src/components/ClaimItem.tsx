import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import FormInput from "./common/FormInput";
import FileUpload from "./common/FileUpload";
import usePost from "@/hooks/usePost";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

const ClaimFormSchema = z.object({
  answers: z.array(
    z.object({
      question: z.string(),
      answer: z.string().min(1, "Answer is required"),
    })
  ),
  proofPhoto: z.array(z.instanceof(File)),
});

type ClaimFormValues = z.infer<typeof ClaimFormSchema>;

const ClaimItem = ({ item, disabled }: any) => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(ClaimFormSchema),
    defaultValues: {
      answers:
        item?.verificationQuestions?.map((q: any) => ({
          question: q.question,
          answer: "",
        })) || [],
      proofPhoto: [],
    },
  });

  const { mutate, isPending } = usePost<any, FormData>(
    `/claim/${item?._id}`,
    ["claim-item"],
    {
      onSuccess: (res) => {
        console.log("res", res);

        toast.success(res.data.message);
        form.reset();
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

  const onSubmit = async (data: ClaimFormValues) => {
    const formData = new FormData();

    formData.append("answers", JSON.stringify(data.answers));

    if (data.proofPhoto && data.proofPhoto.length > 0) {
      data.proofPhoto.forEach((file) => {
        formData.append("proofPhoto", file);
      });
    }

    console.log("formData", formData);
    mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild disabled={disabled}>
        <Button className="w-full">Claim This Item</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl md:max-w-3xl ">
        <DialogHeader>
          <DialogTitle>Claim {item?.title}</DialogTitle>
          <DialogDescription>
            Please answer the following verification questions.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-3">
          <Form {...form}>
            <form
              id="claim-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {item?.verificationQuestions?.map(
                (question: any, index: number) => (
                  <div key={question._id || index}>
                    <div key={question._id || index}>
                      <FormInput
                        name={`answers.${index}.answer`}
                        control={form.control}
                        placeholder="Type your answer"
                        required
                        label={question.question}
                      />
                      <input
                        type="hidden"
                        {...form.register(`answers.${index}.question`)}
                        value={question.question}
                      />
                    </div>
                  </div>
                )
              )}

              <FileUpload
                name="proofPhoto"
                label="Proof of Ownership *"
                control={form.control}
                accept="image/*"
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="claim-form" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Claim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimItem;
