export interface Dataset {
  classNames: string[];
  vocab: string[];
  wordCounts: Record<string, Record<string, number>>;
}
