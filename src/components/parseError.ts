import SafeError from './SafeError';

export default (path: string, message: string) =>
    new SafeError(`Couldn't parse ${path} as it's ${message}`);