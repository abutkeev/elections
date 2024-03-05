import { CandidateDto } from 'src/elections/dto/candidate.dto';
import Counter from './counter';
import Matrix from './matrix';

class SchulzeElections {
  private votes: number[][];
  private candidates: number[];
  private counter: Counter;
  private d_matrix: Matrix;
  private p_matrix: Matrix;

  private count_d_matrix() {
    for (const row of this.candidates) {
      for (const col of this.candidates) {
        if (row == col) continue;

        for (const vote of this.votes) {
          if (this.is_stronger(row, col, vote)) {
            this.d_matrix.inc_cell(row, col);
          }
        }
      }
    }
  }

  private count_p_matrix() {
    for (const i of this.candidates) {
      for (const j of this.candidates) {
        if (i != j) {
          if (this.d_matrix.get_cell(i, j) > this.d_matrix.get_cell(j, i)) {
            this.p_matrix.set_cell(i, j, this.d_matrix.get_cell(i, j));
          }
        }
      }
    }

    for (const i of this.candidates) {
      for (const j of this.candidates) {
        if (i != j) {
          for (const k of this.candidates) {
            if (i != k && j != k) {
              this.p_matrix.set_cell(
                j,
                k,
                Math.max(
                  this.p_matrix.get_cell(j, k),
                  Math.min(this.p_matrix.get_cell(j, i), this.p_matrix.get_cell(i, k))
                )
              );
            }
          }
        }
      }
    }
  }

  private is_stronger(a: number, b: number, vote: number[]) {
    if (a == b) return false;

    for (const entry of vote) {
      if (entry == a) return true;
      if (entry == b) return false;
    }
    return false;
  }

  constructor(candidates: CandidateDto[], votes: number[][]) {
    this.votes = votes;
    this.candidates = candidates.map(({ user_id }) => user_id);
    this.counter = new Counter(this.candidates);

    this.d_matrix = new Matrix(this.candidates);
    this.p_matrix = new Matrix(this.candidates);

    this.count_d_matrix();
    this.count_p_matrix();
  }

  get_quorum() {
    return Math.floor(this.votes.length / 2 + 1);
  }

  get_results() {
    const result = new Counter(this.candidates);
    for (const a of this.candidates) {
      for (const b of this.candidates) {
        if (this.p_matrix.get_cell(a, b) > this.p_matrix.get_cell(b, a)) {
          result.inc(a);
        }
      }
    }
    return result.get_results();
  }

  get_firsts() {
    this.counter.zero();
    for (const vote of this.votes) {
      if (!vote.length) continue;
      this.counter.inc(vote[0]);
    }
    return this.counter.get_results();
  }

  get_five() {
    this.counter.zero();
    for (const vote of this.votes) {
      for (let i = 0; i < Math.min(vote.length, 5); i++) {
        this.counter.inc(vote[i]);
      }
    }
    return this.counter.get_results();
  }

  get_lasts() {
    this.counter.zero();
    for (const vote of this.votes) {
      const last = this.candidates.filter(id => !vote.includes(id));
      for (const candidate of last) {
        this.counter.inc(candidate);
      }
    }
    return this.counter.get_results();
  }

  get_p_matrix() {
    return this.p_matrix.get();
  }

  get_d_matrix() {
    return this.d_matrix.get();
  }
}

export default SchulzeElections;
