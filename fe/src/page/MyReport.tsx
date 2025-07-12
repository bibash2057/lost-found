import useFetch from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import Text from "@/components/common/Text";
import { Button } from "@/components/ui/button";
import ItemsCard from "@/components/common/ItemsCard";

const MyReport = () => {
  const { data } = useFetch("/reportedItem", ["reported-item"]);
  console.log("data", data?.data);

  return (
    <div>
      <Text type="subTitle" className="text-lg font-medium py-5">
        My Reported Items
      </Text>
      {data?.data?.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-10">
          <Text className="text-lg font-semibold">
            You haven't reported any items yet.
          </Text>
          <Text>Start by reporting a lost or found item to see it here!</Text>
          <Link to={"/reportItem"}>
            <Button variant={"link"} className="underline">
              Report Item
            </Button>
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MyReport;
