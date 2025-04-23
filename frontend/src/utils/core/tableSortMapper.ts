import { SortingState } from "@tanstack/react-table"
import { SortParams } from "../../types/core.types"

export const stateToSortBy = (sorting: SortingState | undefined) => {
  if (!sorting || sorting.length === 0) return undefined;

  const sort = sorting[0];
  
  return `${sort.desc ? "-" : ""}${sort.id}` as const;
};

export const sortByToState = (sortBy: SortParams["sortBy"] | undefined) => {
  if (!sortBy) return [];

  // Verifica si comienza con "-" para determinar si es descendente
  const desc = sortBy.startsWith("-");
  

  const id = desc ? sortBy.substring(1) : sortBy;
  
  return [{ id, desc }];
};