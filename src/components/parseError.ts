export default (path: string, message: string) =>
    new Error(`Couldn't parse ${path} as it's ${message}`);