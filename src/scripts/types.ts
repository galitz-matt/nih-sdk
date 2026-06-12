export type ApiItem = {
  value: string;
};

export type ApiItemWithChildren = {
  name: string | null;
  display: string | null;
  value: string | null;
  children_values: string[] | null;
};

export type ApiItemWithParent = {
  name: string | null;
  display: string | null;
  value: string | null;
  parent_value: string | null;
  properties: Properties
}

type Properties = {
  Description: string | null
} | null