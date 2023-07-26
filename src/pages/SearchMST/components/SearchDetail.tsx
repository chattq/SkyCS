import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { authAtom, showErrorAtom } from "@/packages/store";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { Form } from "devextreme-react";
import { Item } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { currentInfo } from "./store";
import { encodeFileType } from "@/components/ulti";
import { nanoid } from "nanoid";
import TagComponent from "./TagComponent";

export default function SearchDetail() {
  const { t } = useI18n("SearchMST");

  const navigate = useNavigate();
  const { idInforSearch } = useParams();
  const auth = useAtomValue(authAtom);
  const [iconShare, setIconShare] = useState<any>("");
  const [data, setData] = useState<any>({});
  const api = useClientgateApi();
  const [dataCurrent, setCurrentItemData] = useState<any>([]);
  const showError = useSetAtom(showErrorAtom);
  const {
    data: dataDetail,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["SearchDetail", idInforSearch],
    queryFn: async () => {
      if (idInforSearch) {
        const response = await api.KB_PostData_GetByPostCode(
          idInforSearch,
          auth.networkId
        );

        if (response.isSuccess) {
          const listUpload = response?.Data?.Lst_KB_PostAttachFile ?? [];
          const newUpdateLoading = listUpload.map((item: any) => {
            return {
              ...item,
              FileId: nanoid(),
              FileFullName: item.FileName,
              FileType: encodeFileType(item.FileType),
              FileUrlLocal: item.FilePath,
            };
          });
          setCurrentItemData({
            uploadFiles: newUpdateLoading,
          });
          setData(response.Data?.KB_Post);
          if (response.Data?.KB_Post.ShareType === "PRIVATE") {
            setIconShare("lock.png");
          } else if (response.Data?.KB_Post.ShareType === "ORGANIZATION") {
            setIconShare("ORGANIZATION.png");
          } else if (response.Data?.KB_Post.ShareType === "PUBLIC") {
            setIconShare("public.png");
          }

          return response.Data;
        } else {
          showError({
            message: t(response.errorCode),
            debugInfo: response.debugInfo,
            errorInfo: response.errorInfo,
          });
        }
      } else {
        return [] as any;
      }
    },
  });
  useEffect(() => {
    refetchGetByCode();
  }, []);

  return (
    <div>
      <div className="px-[16px] py-[14px] shadow-md">
        <div className="flex gap-2 items-center">
          <div className="h-[15px] cursor-pointer" onClick={() => navigate(-1)}>
            <img
              src="/images/icons/arrow_back.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="line-clamp-2 text-[16px] font-bold search_title">
            {data.Title}
          </div>
        </div>
        <div className="mt-2 flex gap-2 items-center">
          <div className="flex">
            <div className="h-[15px]">
              <img
                src={`/images/icons/${
                  data.ShareType === "PRIVATE"
                    ? "lock.png"
                    : data.ShareType === "NETWORK"
                    ? "ORGANIZATION.png"
                    : data.ShareType === "ORGANIZATION"
                    ? "public.png"
                    : ""
                }`}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="line-clamp-2 ml-[12px]">{data?.CreateBy}</div>
          </div>
          <div className="border-r-[2px] border-l-[2px] px-3">
            {data.LogLUDTimeUTC}
          </div>
          <div className="px-2">{data.kbc_CategoryName}</div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="w-[50%]">
            {
              <TagComponent
                dataTag={dataDetail?.Lst_KB_PostTag}
                totalTag={3}
                nameTag={"mt_TagName"}
              />
            }
          </div>
          {data?.Data?.KB_Post.FlagEdit === "1" ? (
            <div className="flex gap-1 items-center bg-red-600 px-1 py-[7px] rounded">
              <div>
                <img src="/images/icons/warning.png" alt="" />
              </div>
              <div className="text-white">{t("Report needs fixing")}</div>
            </div>
          ) : null}
        </div>
      </div>
      <div>
        <div className="px-[45px] py-[25px]">
          <div
            dangerouslySetInnerHTML={{
              __html: data.Detail,
            }}
          />
          <div>
            <Form formData={dataCurrent} labelMode="hidden">
              <Item
                itemType={"simple"}
                dataField={"uploadFiles"}
                render={(param: any) => {
                  const { component: formComponent, dataField } = param;
                  return (
                    <UploadFilesField
                      readonly={true}
                      className={"Upload_Detail_search"}
                      formInstance={formComponent}
                      onValueChanged={(files: any) => {
                        formComponent.updateData(dataField, files);
                      }}
                    />
                  );
                }}
              ></Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
