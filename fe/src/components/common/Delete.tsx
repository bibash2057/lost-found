import React from "react";
import { Trash } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import useDelete from "@/hooks/useDelete";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type DeleteProps = {
  id: string;
  url: string;
  itemKeys?: string[];
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  delete?: React.ReactNode;
};

const Delete = ({
  id,
  url,
  itemKeys = [],
  title = "Are you sure you want to delete this Item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  delete: customDeleteIcon,
}: DeleteProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate } = useDelete(url, itemKeys, {
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: itemKeys });
    },
    onError: (err) => {
      console.log("err", err);
      toast.error("Item Delete", {
        description: err.response?.data?.message || "Please try again",
      });
    },
  });

  const handleDelete = () => {
    if (id) {
      mutate({ id });
      setIsDialogOpen(false);
    }
  };
  return (
    <>
      {customDeleteIcon ? (
        <div onClick={() => setIsDialogOpen(true)}>{customDeleteIcon}</div>
      ) : (
        <Trash
          size={18}
          className="text-red-500 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        />
      )}

      <ConfirmDialog
        open={isDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
        title={title || "Are you sure you want to delete this Item?"}
        description={description || "This action cannot be undone."}
        confirmText={confirmText}
        cancelText={cancelText}
      />
    </>
  );
};

export default Delete;
