import { Info } from "lucide-react";
import Text from "./Text";

const ImportantTips = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <Text className="text-sm font-semibold text-blue-800">
            Important Tips
          </Text>
          <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc list-inside">
            <li>Be as specific as possible in your description</li>
            <li>Include any unique identifying features</li>
            <li>The more details you provide, the better chance of a match</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantTips;
