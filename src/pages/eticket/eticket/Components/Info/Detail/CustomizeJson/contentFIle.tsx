import { splitString } from "@/components/ulti";
import { Icon } from "@/packages/ui/icons";
import React, { memo } from "react";

interface Props {
  item: any;
}

const ContentFile = memo(({ item }: Props) => {
  const valueShow = Array.isArray(item.value) ? item.value : [];

  return (
    <div className="list-file">
      {valueShow.map((itemFile: any) => {
        const fileType = itemFile.FileFullName.split(".").pop();
        console.log("fileType ", fileType);

        return (
          <div className="file-style">
            <Icon name={fileType} />
            <p>{splitString(itemFile.FileFullName, 30)}</p>
          </div>
        );
      })}
    </div>
  );
});

export default ContentFile;
