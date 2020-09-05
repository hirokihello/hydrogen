export enum ChangedType {
  None,
  /** nodeの型が違う */
  Type,
  Text,
  /** ノード名(タグ名)が違う */
  Node,
  Value,
  Attr
}
