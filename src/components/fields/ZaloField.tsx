import { useClientgateApi } from "@/packages/api";
import { Icon } from "@/packages/ui/icons";
import {
  Button,
  Popup,
  ScrollView,
  SelectBox,
  TextBox,
} from "devextreme-react";
import CustomStore from "devextreme/data/custom_store";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

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

  const handleAdd = (value: any) => {
    component.updateData("ZaloUserFollowerId", [
      ...ZaloUserFollowerId,
      {
        id: ZaloUserFollowerId.length + 1,
        ZaloUserFollowerId: value,
        FlagDefault: ZaloUserFollowerId.length == 0 ? "1" : "0",
        SolutionCode: "SKYCS",
      },
    ]);
    setZalo([
      ...ZaloUserFollowerId,
      {
        id: ZaloUserFollowerId.length + 1,
        ZaloUserFollowerId: value,
        FlagDefault: ZaloUserFollowerId.length == 0 ? "1" : "0",
        SolutionCode: "SKYCS",
      },
    ]);
    handleClose();
  };

  const ref: any = useRef();

  const api = useClientgateApi();

  const store = new CustomStore({
    key: "user_id",

    load: async (loadOptions) => {
      const resp: any = await api.Zalo_SearchZaloUser({
        ZaloUserName: loadOptions?.searchValue,
      });
      return resp?.Data ?? [];
    },

    byKey: async (key) => {
      return [];
    },
  });

  const handleChoose = () => {
    const value = ref?.current?.instance?.option("value");

    if (!value) {
      return;
    }

    if (
      value &&
      !ZaloUserFollowerId?.find(
        (item: any) => item?.ZaloUserFollowerId == value
      )
    ) {
      handleAdd(value);
    } else {
      toast.error("Người dùng đã tồn tại!");
    }
  };

  const renderItem = (data: any) => {
    return (
      <div className="flex gap-3 items-center">
        <div>
          <img src={data?.avatar} alt="" className="h-[50px] w-[50px]" />
        </div>
        <div>{data?.display_name}</div>
      </div>
    );
  };

  const renderListZalo = () => {
    return (
      <>
        <SelectBox
          dataSource={store}
          ref={ref}
          valueExpr="user_id"
          showClearButton
          itemRender={renderItem}
          dropDownOptions={{
            minHeight: 300,
          }}
          searchEnabled
          displayExpr="display_name"
        ></SelectBox>

        <div className="mt-[10px] flex justify-end">
          <Button
            style={{
              padding: 10,
              background: "green",
              color: "white",
            }}
            onClick={handleChoose}
          >
            Chọn
          </Button>
        </div>
      </>
    );
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
          }}
          className={"mx-2 w-[100px]"}
        />
      )}

      <Popup
        visible={openPopup}
        hideOnOutsideClick={true}
        onHiding={handleClose}
        showCloseButton
        width={500}
        height={300}
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
