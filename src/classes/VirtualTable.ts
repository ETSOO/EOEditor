/**
 * Virtual table manipulation
 */
export class VirtualTable {
  /**
   * Virtual tables
   */
  static tables: VirtualTable[] = [];

  // Columns
  private columns!: number;

  // Rows
  private rows!: number;

  // Cells
  private cells!: HTMLTableCellElement[][];

  /**
   * HTML DOM Table
   */
  public get HTMLTable() {
    return this.table;
  }

  /**
   * Constructor
   * @param table HTML table
   */
  constructor(private table: HTMLTableElement) {
    this.reset();
    VirtualTable.tables.push(this);
  }

  private reset() {
    this.rows = this.table.rows.length;

    this.columns = 0;
    const firstRow = this.table.rows.item(0);
    if (firstRow) {
      for (const cell of firstRow.cells) {
        this.columns += cell.colSpan;
      }
    }

    this.cells = new Array(this.rows);
    for (let r = 0; r < this.rows; r++) {
      this.cells[r] = new Array(this.columns);
    }

    for (let r = 0; r < this.rows; r++) {
      const row = this.table.rows[r];
      let realCol = 0;
      for (let c = 0; c < row.cells.length; c++) {
        const col = row.cells.item(c)!;
        for (let rs = 0; rs < col.rowSpan; rs++) {
          const cells = this.cells[r + rs];
          const emptyIndex =
            cells[realCol] == null
              ? realCol
              : cells.findIndex((c, index) => index >= realCol && c == null);
          for (let cs = 0; cs < col.colSpan; cs++) {
            cells[emptyIndex + cs] = col;
          }
        }
        realCol += col.colSpan;
      }
    }
  }

  /**
   * Insert column to the right
   * @param cell Current cell
   */
  addColumnAfter(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return;

    const index = this.getCellIndex(tr, cell);

    for (let r = 0; r < this.rows; r++) {
      const cols = this.cells[r];
      if (cols.length > this.columns) continue;

      const cell = cols[index];

      const nextIndex = index + 1;
      const end = nextIndex === this.columns;
      if (end || cols[nextIndex] != cell) {
        const newCell = cell.cloneNode() as HTMLTableCellElement;
        if (newCell.colSpan > 1) {
          newCell.removeAttribute("colSpan");
        }

        const cellTr = cell.closest("tr")!;
        cellTr.insertBefore(
          newCell,
          end
            ? null
            : cols.find((c, i) => i > index && cellTr.contains(c)) ?? null
        );

        for (let rs = 0; rs < newCell.rowSpan; rs++) {
          if (end) this.cells[r + rs].push(newCell);
          else this.cells[r + rs].splice(nextIndex, 0, newCell);
        }
      } else {
        cell.colSpan++;
        if (end) cols.push(cell);
        else cols.splice(nextIndex, 0, cell);
      }
    }

    this.columns++;
  }

  /**
   * Insert column to the left
   * @param cell Current cell
   */
  addColumnBefore(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return;

    const index = this.getCellIndex(tr, cell);

    for (let r = 0; r < this.rows; r++) {
      const cols = this.cells[r];
      if (cols.length > this.columns) continue;

      const cell = cols[index];

      if (index === 0 || cols[index - 1] != cell) {
        const newCell = cell.cloneNode() as HTMLTableCellElement;
        if (newCell.colSpan > 1) {
          newCell.removeAttribute("colSpan");
        }

        cell.closest("tr")!.insertBefore(newCell, cell);

        for (let rs = 0; rs < newCell.rowSpan; rs++) {
          this.cells[r + rs].splice(index, 0, newCell);
        }
      } else {
        cell.colSpan++;
        cols.splice(index, 0, cell);
      }
    }

    this.columns++;
  }

  /**
   * Add row below
   * @param cell Current cell
   */
  addRowAfter(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return;

    const index = tr.rowIndex;
    const newCells: HTMLTableCellElement[] = [];
    const newTr = tr.cloneNode() as HTMLTableRowElement;
    this.cells[index].forEach((c, i) => {
      let newCell: HTMLTableCellElement;
      if (
        (tr.contains(c) && c.rowSpan === 1) ||
        index + 1 === this.rows ||
        this.cells[index + 1][i] != c
      ) {
        newCell = c.cloneNode() as HTMLTableCellElement;
        newCell.innerHTML = "<br/>";
        newCell.removeAttribute("rowSpan");
        newTr.appendChild(newCell);
      } else {
        c.rowSpan++;
        newCell = c;
      }
      for (let cs = 0; cs < newCell.colSpan; cs++) {
        newCells.push(newCell);
      }
    });

    if (index + 1 === this.rows) {
      this.cells.push(newCells);
    } else {
      this.cells.splice(index + 1, 0, newCells);
    }

    tr.parentElement?.insertBefore(newTr, tr.nextElementSibling);
    this.rows++;
  }

  /**
   * Add row above
   * @param cell Current cell
   */
  addRowBefore(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return;

    const index = tr.rowIndex;
    const newCells: HTMLTableCellElement[] = [];
    const newTr = tr.cloneNode() as HTMLTableRowElement;
    for (const c of this.cells[index]) {
      let newCell: HTMLTableCellElement;
      if (tr.contains(c)) {
        newCell = c.cloneNode() as HTMLTableCellElement;
        newCell.innerHTML = "<br/>";
        newCell.removeAttribute("rowSpan");
        newTr.appendChild(newCell);
      } else {
        c.rowSpan++;
        newCell = c;
      }
      for (let cs = 0; cs < newCell.colSpan; cs++) {
        newCells.push(newCell);
      }
    }

    this.cells.splice(index, 0, newCells);

    tr.parentElement?.insertBefore(newTr, tr);
    this.rows++;
  }

  /**
   * Get cell index
   * @param tr Current row
   * @param cell Cell
   * @returns Cell index
   */
  getCellIndex(tr: HTMLTableRowElement, cell: HTMLTableCellElement) {
    const cells = this.cells[tr.rowIndex];
    return cells.indexOf(cell);
  }

  /**
   * Get cell index
   * @param cell Cell
   * @returns Cell index
   */
  getCellIndexDirect(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return -1;
    return this.getCellIndex(tr, cell);
  }

  getNearCells(cell: HTMLTableCellElement) {
    const cells: HTMLTableCellElement[] = [];
    const tr = cell.closest("tr");
    if (tr) {
      const index = this.getCellIndex(tr, cell);
      if (index !== -1) {
        const rowIndex = tr.rowIndex;

        // Before
        if (rowIndex > 0) cells.push(this.cells[rowIndex - 1][index]);

        // After
        if (rowIndex + 1 < this.rows)
          cells.push(this.cells[rowIndex + 1][index]);

        // Previous
        const trCells = this.cells[rowIndex];
        let pIndex = index - 1;
        while (pIndex >= 0) {
          if (trCells[pIndex] != cell) {
            cells.push(trCells[pIndex]);
            break;
          }
          pIndex--;
        }

        // Next
        let nIndex = index + 1;
        while (nIndex < this.columns) {
          if (trCells[nIndex] != cell) {
            cells.push(trCells[nIndex]);
            break;
          }
          nIndex++;
        }
      }
    }
    return cells;
  }

  private fixSpan() {
    if (
      this.table.rows.length === 1 &&
      this.table.rows.item(0)?.cells.length === 1
    ) {
      const onlyCell = this.table.rows.item(0)?.cells.item(0);
      if (onlyCell) {
        onlyCell.removeAttribute("rowSpan");
        onlyCell.removeAttribute("colSpan");
      }
    } else {
      this.cells.forEach((c, i) => {
        const tr = this.table.rows.item(i);
        if (tr == null) return;

        const minRowSpan = Math.min(...c.map((r) => r.rowSpan));
        c.forEach((r) => {
          if (minRowSpan > 1 && r.rowSpan >= minRowSpan)
            r.rowSpan -= minRowSpan - 1;
          if (r.rowSpan === 1) r.removeAttribute("rowSpan");
        });
      });
    }

    // Reset data
    this.reset();
  }

  /**
   * Remove column
   * @param cell Current cell
   */
  removeColumn(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return;

    const index = this.getCellIndex(tr, cell);

    for (let r = 0; r < this.rows; r++) {
      const cols = this.cells[r];
      if (cols.length < this.columns) continue;

      const removed = cols.splice(index, 1);
      if (removed.length === 0) continue;

      const col = removed[0];
      if (col.colSpan > 1) {
        col.colSpan--;
        if (col.colSpan === 1) col.removeAttribute("colSpan");
        col.innerHTML = "<br/>";
      } else {
        col.remove();
      }
    }

    this.columns--;

    if (this.columns === 0) {
      this.removeTable();
    } else {
      this.fixSpan();
    }
  }

  /**
   * Remove cell
   * @param cell Current cell
   */
  removeRow(cell: HTMLTableCellElement) {
    const tr = cell.closest("tr");
    if (tr == null) return;

    const index = tr.rowIndex;
    const removed = this.cells.splice(index, 1);
    this.rows--;
    tr.remove();
    if (removed.length > 0) {
      const row = removed[0];
      row.forEach((c, i) => {
        if (tr.contains(c)) {
          if (c.rowSpan > 1) {
            for (let rs = 1; rs < c.rowSpan; rs++) {
              // -1 because the row was removed by splice
              const currIndex = index + rs - 1;
              const currTr = this.table.rows.item(currIndex)!;
              const currCells = this.cells[currIndex]
                .map(
                  (cc, ci) =>
                    (currTr.contains(cc)
                      ? [Math.abs(ci - i), cc]
                      : [-1, null]) as [number, HTMLTableCellElement | null]
                )
                .filter((item) => item[0] !== -1)
                .sort((item1, item2) => item1[0] - item2[0]);
              const currCol = currCells[0][1];
              if (currCol) currCol.colSpan++;
            }
          }
          c.remove();
        } else if (c.rowSpan > 1) {
          c.rowSpan--;
          if (c.rowSpan === 1) c.removeAttribute("rowSpan");
        }
      });
    }

    if (this.rows === 0) {
      this.removeTable();
    } else {
      this.fixSpan();
    }
  }

  /**
   * Remove table
   */
  removeTable() {
    this.table.remove();
  }

  /**
   * Split cell
   * @param cell Current cell
   * @param isRow Split to rows?
   * @param qty Qty
   */
  splitCell(cell: HTMLTableCellElement, isRow: boolean, qty: number) {
    if (qty < 2 || qty > 100) return;

    const tr = cell.closest("tr");
    if (tr == null) return;

    const cellIndex = this.getCellIndex(tr, cell);

    const cloneCell = () => {
      const newCell = cell.cloneNode() as HTMLTableCellElement;
      newCell.removeAttribute("rowSpan");
      newCell.innerHTML = "<br/>";
      return newCell;
    };

    if (isRow) {
      const nextSibling = tr.nextElementSibling;
      const cloneSpan = Math.min(cell.rowSpan, qty);
      if (cloneSpan > 1) {
        for (let c = 1; c < cloneSpan; c++) {
          const nextIndex = tr.rowIndex + c;
          const nextTr = this.table.rows.item(nextIndex);
          if (nextTr == null) break;

          nextTr.insertBefore(
            cloneCell(),
            this.cells[nextIndex].find((c, i) =>
              i >= cellIndex && nextTr.contains(c) ? c : null
            ) ?? null
          );

          cell.rowSpan--;
          if (cell.rowSpan === 1) cell.removeAttribute("rowSpan");
        }
      }

      if (qty > cloneSpan) {
        const rowSpan = qty - cloneSpan;
        for (let q = 0; q < rowSpan; q++) {
          const newTr = tr.cloneNode() as HTMLTableRowElement;
          newTr.appendChild(cloneCell());
          tr.parentElement?.insertBefore(newTr, nextSibling);
        }

        const rowSpanItems: HTMLTableCellElement[] = [];
        this.cells[tr.rowIndex].forEach((c) => {
          if (c == cell || rowSpanItems.includes(c)) return;
          c.rowSpan += rowSpan;
          rowSpanItems.push(c);
        });
      }
    } else {
      const colSpan = cell.colSpan;
      const nextSibling = cell.nextElementSibling;
      cell.removeAttribute("colSpan");

      for (let q = 1; q < qty; q++) {
        const newCell = cell.cloneNode() as HTMLTableCellElement;
        newCell.innerHTML = "<br/>";
        if (q + 1 === qty) {
          const leftSpan = colSpan - qty;
          if (leftSpan > 0) newCell.colSpan = leftSpan + 1;
          else if (leftSpan < 0) {
            for (let r = 0; r < this.rows; r++) {
              if (r === tr.rowIndex) continue;
              const rCell = this.cells[r][cellIndex];
              if (this.table.rows[r].contains(rCell)) rCell.colSpan -= leftSpan;
            }
          }
        }

        tr.insertBefore(newCell, nextSibling);
      }
    }

    this.reset();
  }

  /**
   * Merge cells
   * @param cells Cells to merge
   */
  mergeCells(cells: HTMLTableCellElement[]) {
    const first = cells.shift();
    if (first == null) return;

    const tr = first.closest("tr");
    if (tr == null) return;

    const rowIndex = tr.rowIndex;
    const index = this.getCellIndex(tr, first);

    let next = cells.shift();
    while (next) {
      if (
        first.nextElementSibling == next ||
        first.previousElementSibling == next
      ) {
        first.innerHTML += next.innerHTML;
        first.colSpan += next.colSpan;

        const rowSpanDiff = Math.abs(first.rowSpan - next.rowSpan);
        if (rowSpanDiff > 0) {
          const nextIndex = this.getCellIndex(tr, next);
          const adjustCell = (
            rowIndex + 1 < this.rows
              ? this.cells[rowIndex + 1]
              : this.cells[rowIndex - 1]
          )[nextIndex];

          adjustCell.colSpan += rowSpanDiff;

          first.removeAttribute("rowSpan");
        }

        next.remove();
      } else {
        let match: boolean = false;
        if (rowIndex > 0) {
          const pCell = this.cells[rowIndex - 1][index];
          if (pCell == next) {
            match = true;
          }
        }

        if (rowIndex + 1 < this.rows) {
          const nCell = this.cells[rowIndex + 1][index];
          if (nCell == next) {
            match = true;
          }
        }

        if (match) {
          first.rowSpan += next.rowSpan;
          first.innerHTML += next.innerHTML;
          next.remove();
        }
      }

      next = cells.shift();
    }

    this.fixSpan();
  }
}
