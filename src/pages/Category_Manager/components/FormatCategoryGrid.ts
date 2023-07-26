export const getCategories = (categoryArray: any, level = 1) => {
  return categoryArray?.map((category: any) => {
    const newCategory = {
      ...category,
      level,
      hasChildren: category?.Lst_KB_CategoryChildren.length > 0,
    };
    delete newCategory.Lst_KB_CategoryChildren;
    if (newCategory.hasChildren) {
      newCategory.children = getCategories(
        category?.Lst_KB_CategoryChildren,
        level + 1
      );
    }
    return newCategory;
  });
};

export const flattenCategories = (categories: any, result = []) => {
  if (categories) {
    for (const category of categories) {
      const { children, ...rest } = category;
      result.push(rest);
      if (children && children.length > 0) {
        flattenCategories(children, result);
      }
    }
  }

  return result;
};
