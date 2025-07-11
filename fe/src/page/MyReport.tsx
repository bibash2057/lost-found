import ItemsCard from "@/components/common/ItemsCard";
import Text from "@/components/common/Text";
import useFetch from "@/hooks/useFetch";
import React from "react";

const MyReport = () => {
  const { data } = useFetch("/reportedItem", ["reported-item"]);
  console.log("data", data?.data);
  return (
    <div>
      <Text type="subTitle" className="text-lg font-medium py-5">
        My Reported Items
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {data?.data?.map((item: any) => (
          <ItemsCard
            item={item}
            key={item?._id}
            isDelete={true}
            isClaim={true}
          />
        ))}
      </div>
    </div>
  );
};

export default MyReport;
