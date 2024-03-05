class Counter {
  private results: Record<number, number>;

  constructor(keys: number[]) {
    this.results = {};
    for (const key of keys) {
      this.results[key] = 0;
    }
  }

  zero() {
    for (const key of Object.keys(this.results)) {
      this.results[key] = 0;
    }
  }

  get_results() {
    const sorted = Object.entries(this.results).sort((a, b) => b[1] - a[1]);
    return sorted.map(([key, value]) => [+key, value] as const);
  }

  inc(key: number) {
    if (key in this.results) {
      this.results[key]++;
    } else {
      throw new Error('key not found');
    }
  }
}

export default Counter;
