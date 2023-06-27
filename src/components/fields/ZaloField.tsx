import { Icon } from "@/packages/ui/icons";
import { Button, Popup, ScrollView, TextBox } from "devextreme-react";
import { useState } from "react";

export const ZaloField = ({ component, formData, field, editType }: any) => {
  // init data
  component.updateData(
    "ZaloUserFollowerId",
    formData["ZaloUserFollowerId"] || []
  );
  const [ZaloUserFollowerId, setZalo] = useState<any>(
    formData["ZaloUserFollowerId"] || []
  );

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleOpen = () => {
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  const handleRemoveItem = (id: string) => {
    /// remove item at `index` from `ZaloUserFollowerId` list
    const result = ZaloUserFollowerId.filter(
      (_: any, i: number) => _.id !== id
    );

    component.updateData("ZaloUserFollowerId", result);

    setZalo(ZaloUserFollowerId.filter((_: any, i: number) => _.id !== id));
  };
  const handleEditItem = (id: string, val: any) => {
    /// edit item at `index` from `ZaloUserFollowerId` list
    const result = ZaloUserFollowerId.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          value: val,
        };
      }
      return item;
    });
    component.updateData("ZaloUserFollowerId", result);

    setZalo(result);
  };
  // setFormValue(formData);

  const handleCheck = (id: string) => {
    const result = ZaloUserFollowerId.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });

    component.updateData("ZaloUserFollowerId", result);

    setZalo(result);
  };

  const handleAdd = (index: any) => {
    const formData = component.option("formData");
    const data = formData["ZaloUserFollowerId"] || [];
    component.updateData("ZaloUserFollowerId", [
      ...ZaloUserFollowerId,
      {
        id: index,
        ZaloUserFollowerId: index,
        FlagDefault: ZaloUserFollowerId.length == 0 ? "1" : "0",
        SolutionCode: "SKYCS",
      },
    ]);
    setZalo([
      ...ZaloUserFollowerId,
      {
        id: index,
        ZaloUserFollowerId: index,
        FlagDefault: ZaloUserFollowerId.length == 0 ? "1" : "0",
        SolutionCode: "SKYCS",
      },
    ]);
    // console.log(formData);
    handleClose();
  };

  const renderListZalo = () => {
    return Array.from({ length: 10 }, (_: any, i: any) => {
      if (!ZaloUserFollowerId.some((c: any) => c.ZaloUserFollowerId == i))
        return (
          <div
            className="p-3 bg-emerald-400 mb-3 cursor-pointer"
            onClick={() => handleAdd(i)}
          >
            {i}
          </div>
        );
    });
  };

  return (
    <>
      {ZaloUserFollowerId.map((item: any, index: any) => {
        return (
          <div key={item.id} className={"flex items-center my-2"}>
            <input
              type={"radio"}
              className={"mr-2"}
              onChange={async (e: any) => {
                handleCheck(item.id);
              }}
              checked={item.FlagDefault == "1"}
              disabled={!item.ZaloUserFollowerId || editType == "detail"}
            />
            <TextBox
              onValueChanged={async (e: any) =>
                handleEditItem(item.id, e.value)
              }
              validationMessageMode={"always"}
              value={item.ZaloUserFollowerId}
              readOnly={editType == "detail"}
            />
            {editType != "detail" && (
              <Button
                onClick={() => handleRemoveItem(item.id)}
                stylingMode={"text"}
              >
                <Icon name={"trash"} size={14} color={"#ff5050"} />
              </Button>
            )}
          </div>
        );
      })}

      {editType != "detail" && (
        <Button
          text={"Add"}
          type={"default"}
          stylingMode={"contained"}
          onClick={() => {
            handleOpen();
            // const formData = component.option("formData");
            // const data = formData["ZaloUserFollowerId"] || [];
            // component.updateData("ZaloUserFollowerId", [
            //   ...ZaloUserFollowerId,
            //   {
            //     id: nanoid(),
            //     checked: ZaloUserFollowerId.length == 0,
            //     value: null,
            //   },
            // ]);
            // setZalo([
            //   ...ZaloUserFollowerId,
            //   {
            //     id: nanoid(),
            //     checked: ZaloUserFollowerId.length == 0,
            //     value: null,
            //   },
            // ]);
            // // setFormValue(formData);
            // console.log(formData);
          }}
          className={"mx-2 w-[100px]"}
        />
      )}

      <Popup
        visible={openPopup}
        hideOnOutsideClick={true}
        onHiding={handleClose}
        width={500}
        height={500}
        title="ZaloUserFollowerId"
        contentRender={() => (
          <ScrollView showScrollbar="always" width="100%" height="100%">
            <div>{renderListZalo()}</div>
          </ScrollView>
        )}
      ></Popup>
    </>
  );
};
