export const FileType =
  "docx" ||
  "doc" ||
  "xls" ||
  "xlsx" ||
  "ppt" ||
  "pptx" ||
  "txt" ||
  "pdf" ||
  "png" ||
  "jpg" ||
  "gif" ||
  "rar" ||
  "zip" ||
  "7Z";

export const sortByKey = (array: any[], key: string) => {
  return array.sort((a, b) => (a[key] > b[key] ? 1 : -1));
};

export const getYearMonthDate = (a: Date) => {
  var month = a.getUTCMonth() + 1;
  var day = a.getUTCDate();
  var year = a.getUTCFullYear();

  return year + "-" + month + "-" + day;
};

export const distinguish = (a: any) => {
  console.log("a", a);
  const getType = a.constructor;
  if (getType === Date) {
    return getYearMonthDate(a);
  } else return a;
};

export const array_move = (
  arr: any[],
  old_index: number,
  new_index: number
) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

export const encodeFileType = (
  fileType:
    | "docx"
    | "doc"
    | "xls"
    | "xlsx"
    | "ppt"
    | "pptx"
    | "txt"
    | "pdf"
    | "png"
    | "jpg"
    | "gif"
    | "rar"
    | "zip"
    | "7Z"
) => {
  const obj = {
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    pdf: "application/pdf",
    png: "image/x-png",
    jpg: "image/x-citrix-jpeg",
    gif: "image/gif",
    rar: "application/x-rar-compressed",
    zip: "application/zip",
    "7Z": "application/x-7z-compressed",
  };
  return obj[fileType] ?? "";
};

export const revertEncodeFileType = (
  FileType:
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/msword"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.ms-powerpoint"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "text/plain"
    | "application/pdf"
    | "image/x-png"
    | "image/x-citrix-jpeg"
    | "image/gif"
    | "application/x-rar-compressed"
    | "application/zip"
    | "application/x-7z-compressed"
) => {
  const obj = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "text/plain": "txt",
    "application/pdf": "pdf",
    "image/x-png": "png",
    "image/x-citrix-jpeg": "jpg",
    "image/gif": "gif",
    "application/x-rar-compressed": "rar",
    "application/zip": "zip",
    "application/x-7z-compressed": "7Z",
  };
  return obj[FileType] ?? "";
};

export const getDateNow = () => {
  return Date.now();
};

export const compareDates = (d1: any, d2: any) => {
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();
  if (date1 < date2) {
    return false;
  } else if (date1 >= date2) {
    return true;
  }
};

export const splitString = (chuoi: string, soluongkytu: number) => {
  let chuoiSub = "";
  if (
    chuoi !== undefined &&
    chuoi !== null &&
    chuoi.toString().trim().length > 0
  ) {
    chuoi = chuoi.toString().trim();
    if (chuoi.length <= soluongkytu) {
      chuoiSub = chuoi;
    } else {
      const indexOf = chuoi.lastIndexOf(" ", soluongkytu);
      if (indexOf > 0) {
        chuoiSub = chuoi.substring(0, indexOf).trim() + "...";
      } else {
        chuoiSub = chuoi.substring(0, soluongkytu).trim() + "...";
      }
    }
  }
  return chuoiSub;
};
