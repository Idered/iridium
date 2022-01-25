export class RouteParser {
  constructor(private path: string) {}

  protected get regexp(): RegExp {
    const pattern = this.path
      // Escape literal dots
      .replace(/\./g, "\\.")
      // Ignore trailing slashes
      .replace(/\/+$/, "")
      // Replace wildcard with any zero-to-any character sequence
      .replace(/\*+/g, ".*")
      // Replace parameters with named capturing groups
      .replace(/\{(\w+)\}/g, (_, paramName) => `(?<${paramName}>[\\d\\w]+)`)
      // Replace optional parameters with named capturing groups
      .replace(
        /\/\{(\w+)\??\}/g,
        (_, paramName) => `/?(?<${paramName}>[\\d\\w]+)?`
      )
      // Allow optional trailing slash
      .concat("(\\/|$)")
      // Close path match
      .concat("$");
    return new RegExp(pattern, "g");
  }

  public getParams(url: string) {
    return this.regexp.exec(url)?.groups;
  }

  public match(url: string) {
    return this.regexp.test(url);
  }
}
