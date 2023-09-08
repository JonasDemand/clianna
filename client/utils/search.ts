export const searchArray = <T extends Array<any>>(
  arr: T,
  search: string
): T => {
  const searchTerms = search
    .split(' ')
    .map((txt) => `.*${txt.toLowerCase()}.*`);
  return arr.filter((obj) => {
    const searchText = JSON.stringify(obj).toLowerCase();
    return searchTerms.every((term) => searchText.match(term));
  }) as T;
};
