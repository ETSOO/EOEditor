/**
 * Virtual table manipulation
 */
export class VirtualTable {
    // Columns
    private columns: number;

    // Rows
    private rows: number;

    // Cells
    private cells: HTMLTableCellElement[][];

    /**
     * Constructor
     * @param table HTML table
     */
    constructor(private table: HTMLTableElement) {
        this.rows = table.rows.length;

        this.columns = 0;
        const firstRow = table.rows.item(0);
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
            const row = table.rows[r];
            let realCol = 0;
            for (let c = 0; c < row.cells.length; c++) {
                const col = row.cells.item(c)!;
                for (let rs = 0; rs < col.rowSpan; rs++) {
                    const cells = this.cells[r + rs];
                    const emptyIndex =
                        cells[realCol] == null
                            ? realCol
                            : cells.findIndex(
                                  (c, index) => index >= realCol && c == null
                              );
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
        const index = this.getCellIndex(cell);
        console.log(index);
    }

    /**
     * Insert column to the left
     * @param cell Current cell
     */
    addColumnBefore(cell: HTMLTableCellElement) {
        const index = this.getCellIndex(cell);
        console.log(index);
    }

    // Get cell index
    private getCellIndex(cell: HTMLTableCellElement) {
        let index = 0;
        const tr = cell.closest('tr');
        if (tr) {
            for (let r = 0; r < cell.cellIndex; r++) {
                const prevCell = tr.cells[r];
                index += prevCell.colSpan;
            }
        }
        return index;
    }
}
