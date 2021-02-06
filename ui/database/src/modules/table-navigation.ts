import { Ref } from "vue";
import { useDatabase } from "./database";

export function useTableNavigation(tbody: Ref<HTMLTableSectionElement | null>) {
  const db = useDatabase();
  const goRight = (rowIndex: number, columnName: string) => {
    const currentColumnIndex = getCurrentColumnIndex(columnName);
    const nextColumnIndex = currentColumnIndex + 1;
    const nextColumn = db.visibleColumns.value[nextColumnIndex];
    if (nextColumn) {
      const rowElement = getRowElement(rowIndex);
      const columnElement = getCellElement(rowElement, nextColumnIndex);
      columnElement?.focus?.();
      db.selectCell(rowIndex, nextColumn);
    }
  };
  const goLeft = (rowIndex: number, columnName: string) => {
    const currentColumnIndex = getCurrentColumnIndex(columnName);
    const prevColumnIndex = currentColumnIndex - 1;
    const prevColumn = db.visibleColumns.value[prevColumnIndex];
    if (prevColumn) {
      const rowElement = getRowElement(rowIndex);
      const columnElement = getCellElement(rowElement, prevColumnIndex);
      columnElement?.focus?.();
      db.selectCell(rowIndex, prevColumn);
    }
  };
  const goUp = (rowIndex: number, columnName: string) => {
    const currentColumnIndex = getCurrentColumnIndex(columnName);
    const prevRowIndex = rowIndex - 1;
    const prevRow = db.rows.value[prevRowIndex];
    if (prevRow) {
      const rowElement = getRowElement(prevRowIndex);
      const columnElement = getCellElement(rowElement, currentColumnIndex);
      columnElement?.focus?.();
      db.selectCell(prevRowIndex, columnName);
    }
  };
  const goDown = (rowIndex: number, columnName: string) => {
    const currentColumnIndex = getCurrentColumnIndex(columnName);
    const nextRowIndex = rowIndex + 1;
    const nextRow = db.rows.value[nextRowIndex];
    if (nextRow) {
      const rowElement = getRowElement(nextRowIndex);
      const columnElement = getCellElement(rowElement, currentColumnIndex);
      columnElement?.focus?.();
      db.selectCell(nextRowIndex, columnName);
    }
  };

  return {
    goRight,
    goLeft,
    goUp,
    goDown,
  };

  function getCellElement(
    rowElement: HTMLTableRowElement,
    columnIndex: number
  ) {
    return rowElement.children[columnIndex] as HTMLTableCellElement;
  }

  function getRowElement(rowIndex: number) {
    return tbody.value?.children[rowIndex] as HTMLTableRowElement;
  }

  function getCurrentColumnIndex(columnName: string) {
    return db.visibleColumns.value.findIndex((item) => item === columnName);
  }
}
