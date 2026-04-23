export type ApiItem = {
  value: string;
};

export type ApiItemWithChildren = {
  name: string | null;
  display: string | null;
  value: string | null;
  children_values: string[] | null;
};