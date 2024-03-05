class Matrix {
  private matrix: number[][];

  constructor(keys: number[]) {
    this.matrix = [];
    for (const row of keys) {
      this.matrix[row] = [];
      for (const col of keys) {
        this.matrix[row][col] = 0;
      }
    }
  }

  private check_cell_exists({ row, col }: { row: number; col: number }) {
    if (!(row in this.matrix)) {
      throw new Error(`get: row ${row} not found`);
    }
    if (!(col in this.matrix[row])) {
      throw new Error(`get: col ${col} not found`);
    }
  }

  get_cell(row: number, col: number) {
    this.check_cell_exists({ row, col });
    return this.matrix[row][col];
  }

  set_cell(row: number, col: number, value: number) {
    this.check_cell_exists({ row, col });
    this.matrix[row][col] = value;
  }

  inc_cell(row: number, col: number) {
    this.check_cell_exists({ row, col });
    this.matrix[row][col]++;
  }

  get() {
    return this.matrix;
  }
}

export default Matrix;
