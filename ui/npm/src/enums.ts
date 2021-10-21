export enum View {
  Manage,
  Analyze,
  Pro,
}

export enum DownloadSpeed {
  Slow3G = 400 / 8,
  Fast3G = 1000 / 8,
  Slow4G = 1750 / 8,
  Fast4G = 7500 / 8,
}

export enum ErrorType {
  SuggestionsServiceIsNotResponding,
}

export enum Order {
  Ascending,
  Descending,
}

export enum AnalyzeSortType {
  Min = "size",
  GZIP = "gzip",
  Slow3G = "threeG",
  Slow4G = "fourG",
}
