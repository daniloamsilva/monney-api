export function mapSnakeToCamel(obj: object): any {
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    acc[camelKey] = obj[key];
    return acc;
  }, {} as any);
}
