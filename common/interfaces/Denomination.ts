/** A type of physical currency and its face value */
export interface Denomination {
  /** The name of the coin or bill. For example, "quarter" or "penny". */
  name: string;
  /** The value in cents */
  value: number;
}
