const isNullOrEmpty = (value: any) =>
    value === null || value === undefined || value === '';

const isNull = (value: any) =>
    value === null || value === undefined;

export { isNullOrEmpty, isNull };