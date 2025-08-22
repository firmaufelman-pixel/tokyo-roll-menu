export type CategoryContent = {
  readonly category_name: string;
  readonly description: string;
  readonly group: string;
};

export type GroupContent = {
  readonly name: string;
};

export type DishContent = {
  readonly dish_name: string;
  readonly label: string;
  readonly description: string;
  readonly price: string;
  readonly lunch_price: string;
  readonly category: string;
  readonly icons: string[];
  readonly image?: string;
  readonly beliebt?: boolean;
  quantity?: number;
  added?: boolean;
};
