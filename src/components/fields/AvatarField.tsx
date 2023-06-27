import { useRef, useState } from "react";
import { match } from "ts-pattern";

export const AvatarField = ({ component, formData, field }: any) => {
  const defaultAvatar =
    "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";

  const defaultValue = match(typeof formData[field.ColCodeSys])
    .with("undefined", () => {
      return defaultAvatar;
    })
    .with("string", () => {
      return formData[field.ColCodeSys];
    })
    .with("object", () => {
      return defaultAvatar;
    })
    .otherwise(() => defaultAvatar);

  const [avatar, setAvatar] = useState<any>(defaultValue);

  // setFormValue(formData);
  const imgRef: any = useRef();

  const handleUpload = () => {
    imgRef.current?.click();
  };

  const onFileChange = (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    if (fileFromLocal) {
      setAvatar(URL.createObjectURL(fileFromLocal));
      component?.updateData(field.ColCodeSys, fileFromLocal);
      component?.updateData("AVATAR", fileFromLocal);
    }
  };

  return (
    <>
      <div
        className="overflow-hidden h-[100px] w-[100px] rounded-lg shadow-xl mt-[10px] ml-[10px] cursor-pointer"
        style={{ borderRadius: "50%" }}
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
