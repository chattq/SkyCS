import { Popup } from "devextreme-react";
import { nanoid } from "nanoid";
import { useState } from "react";

const PopoverCustomerContact = ({ data, listCustomer }: any) => {
  const defaultAvatar =
    "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const id = nanoid();

  return (
    <div className="relative popover-container" id={id}>
      <div
        className="hover:text-[#00703C] cursor-pointer "
        onClick={handleOpen}
      >
        {data?.CustomerNameContact}
      </div>
      <Popup
        visible={open}
        onHidden={handleClose}
        hideOnOutsideClick
        width="auto"
        height={300}
        showTitle={false}
        hideOnParentScroll
        // container=".popover-container"
      >
        {/* <Position at="right" my="left" /> */}
        <div className="flex flex-col gap-1">
          {listCustomer?.map((item: any) => {
            return (
              <div className="flex gap-1 items-center" key={nanoid()}>
                <div
                  className="w-[30px] h-[30px]"
                  style={{ borderRadius: "50%" }}
                >
                  <img
                    src={item?.CustomerAvatarPath ?? defaultAvatar}
                    className="w-full h-full overflow-hidden"
                    style={{ borderRadius: "50%" }}
                  />
                </div>
                <div>{item?.CustomerName}</div>
              </div>
            );
          })}
        </div>
      </Popup>
    </div>
  );
};

export default PopoverCustomerContact;
