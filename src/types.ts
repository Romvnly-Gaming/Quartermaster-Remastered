export interface UserMedals {
    name:        string;
    id:          number;
    description: string;
    adjudicator: string;
    eligibility: string;
    type:        Type;
    quantity:    number;
    medals:      string[];
}

export enum Type {
    Medal = "MEDAL",
    Order = "ORDER",
}
