import { useClientgateApi } from "@/packages/api";
import { useRef, useState } from "react";

export const AvatarField = ({ component, formData, field, editType }: any) => {
  const defaultAvatar =
    "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";

  const [avatar, setAvatar] = useState<any>(
    formData[field.ColCodeSys] ?? defaultAvatar
  );

  const api = useClientgateApi();

  // setFormValue(formData);
  const imgRef: any = useRef();

  const handleUpload = () => {
    imgRef.current?.click();
  };

  const onFileChange = async (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    if (fileFromLocal) {
      const resp: any = await api.SysUserData_UploadFile(fileFromLocal);
      if (resp?.isSuccess) {
        setAvatar(resp?.Data?.FileUrlFS);
        component?.updateData(field.ColCodeSys, resp?.Data?.FileUrlFS);
      }
    }
  };

  return (
    <>
      <div
        className="overflow-hidden h-[100px] w-[100px] rounded-lg shadow-xl mt-[10px] ml-[10px] cursor-pointer"
        style={{
          borderRadius: "50%",
          pointerEvents: editType == "detail" ? "none" : "unset",
        }}
      >
        <div className="h-full w-full" onClick={handleUpload}>
          <img alt="" className="w-full h-full object-cover" src={avatar} />
          <input
            type="file"
            ref={imgRef}
            hidden
            onChange={onFileChange}
            accept="image/png, image/gif, image/jpeg"
          />
        </div>
      </div>
    </>
  );
};
