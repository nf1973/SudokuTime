export type PlaceMove = {
  moveType: 'place';
  row: number;
  col: number;
  from: number;
  to: number;
};

export type MarkMove = {
  moveType: 'mark';
  row: number;
  col: number;
  from: number[];
  to: number[];
};

// Union type to represent any move
export type Move = PlaceMove | MarkMove;
