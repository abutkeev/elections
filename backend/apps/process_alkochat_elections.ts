// typescript version of https://github.com/abutkeev/alkochat_elections/blob/stable/analyze.php
import { createReadStream } from 'fs';
import SchulzeElections from '../libs/schulze/schulze-elections';
import csvParser from 'csv-parser';
import { CandidateDto } from 'src/elections/dto/candidate.dto';

if (process.argv.length !== 3) {
  console.error('Usage: npx ts-node', process.argv[0], '<data.csv>');
  console.error();
  process.exit(255);
}

let nextId = 1;
const candidateMap: Record<string, number> = {};
const candidates: CandidateDto[] = [];
const votes: number[][] = [];

const print_results = (results: (readonly [number, number])[]) => {
  let i = 1;
  for (const [user_id, result] of results) {
    const { name } = candidates.find(entry => entry.user_id === +user_id);
    console.log(`${i}. ${name}: ${result}`);
    i++;
  }
};

createReadStream(process.argv[2])
  .pipe(csvParser({ headers: false }))
  .on('data', data => {
    const vote = Object.entries(data).map(([_, name]) => name as string);
    const last = vote.pop().split(',');

    const addCandidate = (name: string) => {
      candidateMap[name] = nextId;
      candidates.push({ user_id: nextId, name, program: '' });
      nextId++;
    };

    votes.push(
      vote.map(name => {
        if (name in candidateMap) {
          return candidateMap[name];
        }
        addCandidate(name);
        return nextId - 1;
      })
    );

    for (const name of last) {
      if (!(name in candidateMap)) {
        addCandidate(name);
      }
    }
  })
  .on('end', () => {
    const e = new SchulzeElections(candidates, votes);

    console.log('Топ первых мест:');
    print_results(e.get_firsts());
    console.log();

    console.log('Топ Капотни:');
    print_results(e.get_lasts());
    console.log();

    console.log('Вхождений в топ-5:');
    print_results(e.get_five());
    console.log();

    console.log('Результат по Шульце:');
    print_results(e.get_results());
    console.log();

    console.log('Кворум:', e.get_quorum());
  });
