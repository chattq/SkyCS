import { Button, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue } from "jotai";
import React from "react";
import { popupVisibleAtom } from "../store";
import { useI18n } from "@/i18n/useI18n";

interface Props {
  onCancel: () => void;
  handleSave: () => void;
}

const index = ({ onCancel, handleSave }: Props) => {
  const {t} = useI18n("TransformCustomer");
  const popupVisible = useAtomValue(popupVisibleAtom);
  return (
    <Popup
      className="popup-campaign"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={`Add Field`}
      width={700}
      height={450}
      visible={popupVisible}
    >


      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default index;
