export enum MovementType {
  Debit = 1,
  Credit = 2
}

export module MovementType{
  export function toDisplayName(value: MovementType): string {
    switch (value) {
      case MovementType.Debit:
        return `Débito`;
      case MovementType.Credit:
        return `Crédito`;
      default:
        return null;
    }
  }
}


