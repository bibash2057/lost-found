import useFetch from "@/hooks/useFetch";
import Text from "@/components/common/Text";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import usePatch from "@/hooks/usePatch";
import { toast } from "sonner";

const ClaimReport = () => {
  const { id } = useParams();
  const [claimId, setClaimId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const { data, isFetching, error } = useFetch(`/claimReport/${id}`, [
    "claimReport",
    `${id}`,
  ]);

  const { mutate, isPending } = usePatch<any>(
    `/claimUpdate/${claimId}`,
    ["claim-report-update", claimId],
    {
      onSuccess: (res) => {
        console.log("res", res);

        toast.success(res.data.message);
      },
      onError: (err) => {
        console.log("err", err);
        toast.error("Item Add", {
          description: err.response?.data?.message || "Please try again",
        });
      },
    },
    {}
  );

  const handleStatusUpdate = (status: "Approved" | "Rejected") => {
    const payload = { status };
    console.log("Sending payload:", payload);
    mutate(payload);
  };

  if (isFetching) {
    return <div className="p-4">Loading claim report...</div>;
  }

  if (error) {
    return (
      <div className="p-4">Error loading claim report: {error.message}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Text type="subTitle" className="text-2xl font-semibold mb-2">
          {data?.data?.item?.title}
        </Text>
        <div className="flex gap-2">
          <Badge variant={data?.data?.item?.type === "Lost" ? "red" : "purple"}>
            {data?.data?.item?.type}
          </Badge>
          <Badge
            variant={
              data?.data?.item?.status === "Open"
                ? "blue"
                : data?.data?.item?.status === "Verifying"
                ? "yellow"
                : "green"
            }
          >
            {data?.data?.item?.status}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Item Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={
                    data?.data?.item?.photos?.[selectedImage] ||
                    "/placeholder.jpg"
                  }
                  alt="Item"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto py-2">
                {data?.data?.item?.photos?.map(
                  (photo: string, index: number) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-16 w-16 rounded-md overflow-hidden border-2 cursor-pointer ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Text className="text-sm text-gray-500 mb-1">Description</Text>
                <p className="text-sm">{data?.data?.item?.des}</p>
              </div>
              <Separator />
              <div>
                <Text className="text-sm text-gray-500 mb-1">Location</Text>
                <p className="text-sm">{data?.data?.item?.location}</p>
              </div>
              <Separator />
              <div>
                <Text className="text-sm text-gray-500 mb-1">Category</Text>
                <p className="text-sm">{data?.data?.item?.category}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Text type="heading">
            Claim Requests ({data?.data?.claims?.length || 0})
          </Text>

          {data?.data?.claims?.length === 0 ? (
            <Text className="text-sm text-gray-500">No claims yet</Text>
          ) : (
            data?.data?.claims?.map((claim: any) => (
              <div key={claim._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Text className="font-medium">{claim.claimedBy?.name}</Text>
                  </div>
                  <Badge
                    variant={
                      claim.status === "Approved"
                        ? "green"
                        : claim.status === "Rejected"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {claim.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <Text className="text-sm font-medium mb-2">
                    Verification Answers
                  </Text>
                  <div className="space-y-2">
                    {claim.answers?.map((answer: any, idx: number) => (
                      <div key={answer._id} className="text-sm">
                        <Text
                          type="description"
                          className="font-medium text-gray-700"
                        >
                          {answer.question}
                        </Text>
                        <Text type="description" className="text-gray-700">
                          {answer.answer}
                        </Text>
                        {idx < claim.answers.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {claim.proofPhoto?.length > 0 && (
                  <div className="mb-4">
                    <Text className="text-sm font-medium mb-2">
                      Proof of Ownership
                    </Text>
                    <div className="grid grid-cols-2 gap-2">
                      {claim.proofPhoto.map((photo: string, idx: number) => (
                        <div
                          key={idx}
                          className="aspect-square bg-gray-100 rounded-md overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`Proof ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {claim.status === "Pending" && (
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setClaimId(claim?._id), handleStatusUpdate("Rejected");
                      }}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setClaimId(claim?._id), handleStatusUpdate("Approved");
                      }}
                      disabled={isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimReport;
