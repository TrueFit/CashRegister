import { ChangeResponseBody } from "../../common/interfaces";
import { BASE_URL, DEFAULT_CURRENCY } from "./constants";

export const fetchChange = async (
  owed: number,
  paid: number
): Promise<ChangeResponseBody> => {
  const url = `${BASE_URL}/change?owed=${owed}&paid=${paid}&currency=${DEFAULT_CURRENCY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
