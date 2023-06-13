import { useClientgateApi } from "@/packages/api";
import { useMutation } from "@tanstack/react-query";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { AvatarData, viewingDataAtom } from "./store";
import { useAtomValue, useSetAtom } from "jotai";

export const getAvatarUrl = (avatarName: any) => {
  if (avatarName) {
    return avatarName;
  } else {
    return "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";
  }
};

export default function UploadAvatar({ data, setAvt }: any) {
  const imgRef = useRef<any>();
  const [file, setFile] = useState<any>();
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);
  const handleUpload = () => {
    imgRef.current?.click();
  };
  const onFileChange = (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    setFile(fileFromLocal);
    setAvt(fileFromLocal);
  };

  return (
    <div className="overflow-hidden h-[190px] w-[190px] rounded-lg shadow-xl mt-[40px]">
      <div className="h-full w-full" onClick={handleUpload}>
        <img
          alt=""
          className="w-full h-full object-cover"
          src={previewImage || getAvatarUrl(data)}
        />
        <input type="file" ref={imgRef} hidden onChange={onFileChange} />
      </div>
    </div>
  );
}
