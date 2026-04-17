export type ApiItem = {
  value: string;
};

export type ApiItemWithChildren = {
  name: string | null;
  value: string;
  children_values: string[] | null;
};