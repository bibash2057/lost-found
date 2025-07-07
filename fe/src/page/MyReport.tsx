import ItemsCard from "@/components/common/ItemsCard";
import useFetch from "@/hooks/useFetch";
import React from "react";

const MyReport = () => {
  const { data } = useFetch("/reportedItem", ["reported-item"]);
  console.log("data", data?.data);
  return (
    <div>
      <p>hello</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {data?.data?.map((item: any) => (
          <ItemsCard item={item} key={item?._id} isDelete={true} />
        ))}
      </div>
    </div>
  );
};

export default MyReport;
