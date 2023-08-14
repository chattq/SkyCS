import { DataGrid, Form, TextBox } from "devextreme-react";
import {
  ButtonItem,
  ButtonOptions,
  Item,
  Label,
  SimpleItem,
} from "devextreme-react/form";
import React, { useRef } from "react";
import HtmlEditor from "devextreme-react/html-editor";
import {
  Column,
  Editing,
  GroupPanel,
  Grouping,
  HeaderFilter,
  Pager,
  Paging,
} from "devextreme-react/data-grid";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { FlagActiveEnum } from "@/packages/types";

// import {text} from "msw";

export const TestFormPage = () => {
  const formData = {
    Province: "",
    District: "",
    Ward: "",
  };
  const api = useClientgateApi();

  const { data: dataProvince, isLoading: isLoadingProvince } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await api.Mst_Province_Search({
        FlagActive: FlagActiveEnum.Active,
        Ft_PageIndex: 0,
        Ft_PageSize: 10,
      });
      if (response.isSuccess) {
        return response.DataList;
      } else {
        return [];
      }
    },
  });

  console.log("dataProvince ", dataProvince);

  let formRef = useRef<any>(null);
  const column = [
    {
      dataField: "Province",
      caption: "Tỉnh",
    },
    {
      dataField: "District",
      caption: "Quận Huyện",
    },
    {
      dataField: "Ward",
      caption: "Phường Xã",
    },
  ];

  const handleChange = (e: any) => {
    console.log(
      "e",
      e,
      "formRef?.current",
      formRef?.current,
      "component",
      formRef?.current.instance.option("formData"),
      "e components",
      e.component
    );
  };

  return (
    <div>
      <Form onFieldDataChanged={handleChange} ref={formRef} formData={formData}>
        {column.map((item: any, idx: number) => {
          return <SimpleItem {...item} key={idx} />;
        })}
      </Form>
    </div>
  );
};
