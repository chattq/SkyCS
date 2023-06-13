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
