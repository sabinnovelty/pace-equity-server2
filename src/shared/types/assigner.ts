export interface CommonAssigner {
  by?: string;
  at?: Date;
}

export interface AdminAssigner extends CommonAssigner {}

export interface Assigner extends CommonAssigner {
  id?: string;
  tokenId?: string;
  clientAssigner?: ClientAssigner;
}
export type ClientAssigner = { id?: string; by?: string; at?: Date };
