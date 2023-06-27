import { RefObject, useEffect, useState } from "react";
import { FileUploader } from "devextreme-react/file-uploader";
import { ProgressBar } from "devextreme-react";
import { UploadedFile } from "@packages/types";
import { match } from "ts-pattern";
import { Icon, IconName } from "@/packages/ui/icons";
import Button from "devextreme-react/button";

interface SelectedFileProps {
  file: Partial<UploadedFile>;
  uploaderRef: RefObject<FileUploader>;
  onRemoveFile: (file: Partial<UploadedFile>) => void;
  disabled?: boolean;
}

const getIconName = (fileType: string) => {
  return match(fileType)
    .when(
      () => fileType.startsWith("video"),
      () => "video"
    )
    .when(
      () => fileType.startsWith("image"),
      () => "jpg"
    )
    .when(
      () => fileType.includes("spreadsheet"),
      () => "xlsx"
    )
    .when(
      () => fileType.includes("wordprocessing"),
      () => "docx"
    )
    .when(
      () => fileType.includes("pdf"),
      () => "pdf"
    )
    .otherwise(() => "pdf") as IconName;
};

export const mappingFile = (fileType: string) => {
  return match(fileType)
    .when(
      () => fileType.startsWith("video"),
      () => "video"
    )
    .when(
      () => fileType.startsWith("image"),
      () => "jpg"
    )
    .when(
      () => fileType.includes("spreadsheet"),
      () => "xlsx"
    )
    .when(
      () => fileType.includes("wordprocessing"),
      () => "docx"
    )
    .when(
      () => fileType.includes("pdf"),
      () => "pdf"
    )
    .otherwise(() => "pdf") as IconName;
};

export const SelectedFile = ({
  file,
  uploaderRef,
  onRemoveFile,
  disabled = false,
}: SelectedFileProps) => {
  const handleRemoveFile = (file: Partial<UploadedFile>) => {
    onRemoveFile(file);
  };
  console.log("getIconName ", getIconName(file.FileType!));

  return (
    <div className={"flex-col w-300 m-2 shadow border p-1"}>
      <div className={"flex items-center"}>
        <Icon size={30} name={getIconName(file.FileType!)} />
        <span className={"ml-1"}>{file.FileFullName}</span>
        <Button
          disabled={disabled}
          stylingMode={"text"}
          onClick={() => handleRemoveFile(file)}
        >
          <Icon name={"remove"} />
        </Button>
      </div>
      <ProgressBar
        id="progress-bar-status"
        width="90%"
        min={0}
        value={uploaderRef.current?.instance.option("progress")}
        visible={file.isUploading}
      />
    </div>
  );
};
