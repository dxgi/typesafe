import { IMatch, SafeType } from './components/types';
import what from './components/what';
import { isNull, isNullOrEmpty } from './components/check';
import parseError from './components/parseError';
import SafeError from './components/SafeError';

const typesafe = (schema: IMatch) => {
    return (input: any) => {
        return new Promise((resolve, reject) => {
            const _typesafe = async (_path: string, schemas: any, input: any, array: boolean) => {
                Object.keys(schemas).forEach(async key => {
                    try {
                        const schema = array ? schemas : schemas[key],
                            path = `${_path}.${key}`;

                        switch (what(schema)) {
                            case SafeType.string: {
                                const { min, max, nullable, custom } = array ? schemas.string : schema.string;

                                const value = array ? input : input[key],
                                    empty = isNullOrEmpty(value);

                                if (!nullable && empty)
                                    throw parseError(path, 'empty');
                                
                                if (nullable && empty)
                                    return;

                                if (typeof value !== 'string')
                                    throw parseError(path, 'not a string');

                                if (value.length < min)
                                    throw parseError(path, 'too short');

                                if (max && value.length > max)
                                    throw parseError(path, 'too long');

                                if (custom) {
                                    const result = await custom(value);

                                    if (!result)
                                        throw parseError(path, 'invalid');
                                }

                                break;
                            }
                            case SafeType.number: {
                                const { min, max, nullable, custom } = array ? schemas.number : schema.number;

                                const value = array ? input : input[key],
                                    empty = isNull(value);

                                if (!nullable && empty)
                                    throw parseError(path, 'empty');

                                if (nullable && empty)
                                    return;

                                if (typeof value !== 'number')
                                    throw parseError(path, 'not a number');

                                if (value < min)
                                    throw parseError(path, 'too small');

                                if (max && value > max)
                                    throw parseError(path, 'too big');

                                if (custom) {
                                    const result = await custom(value);

                                    if (!result)
                                        throw parseError(path, 'invalid');
                                }

                                break;
                            }
                            case SafeType.object: {
                                const _schema = array ? schemas.object : schema.object,
                                    _input = array ? input : input[key];

                                if (typeof _input !== 'object')
                                    throw parseError(path, 'not an object');

                                _typesafe(path, _schema, _input, false)
                                    .catch(err => reject(err));

                                break;
                            }
                            case SafeType.array: {
                                const { min, max, items, nullable } = array ? schemas : schema.array;

                                const value = array ? input : input[key],
                                    empty = isNullOrEmpty(value);

                                if (!nullable && empty)
                                    throw parseError(path, 'empty');

                                if (nullable && empty)
                                    return;

                                if (!Array.isArray(value))
                                    throw parseError(path, 'not an array');

                                if (value.length < min)
                                    throw parseError(path, 'too short');

                                if (max && value.length > max)
                                    throw parseError(path, 'too long');

                                value.forEach((item, index) => {
                                    _typesafe(`${path}[${index}]`, items, item, true)
                                        .catch(err => reject(err));
                                });

                                break;
                            }
                            case SafeType.boolean: {
                                const value = array ? input : input[key];

                                if (isNull(value))
                                    throw parseError(path, 'empty');

                                if (typeof value !== 'boolean')
                                    throw parseError(path, 'not a boolean');

                                break;
                            }
                        }
                    } catch (err) {
                        return reject(err);
                    }
                });
            }

            Object.keys(schema).forEach(async (key) => {
                const rule = (schema as any)[key];

                if (!input.hasOwnProperty(key))
                    return reject(new SafeError(`Couldn't resolve input.${key}`));

                _typesafe(key, rule, input[key], false)
                    .then(() => resolve(null))
                    .catch(err => reject(err));
            });
        });
    }
}

const middleware = (schema: IMatch) => {
    return (req: any, res: any, next: any) => {
        typesafe(schema)(req)
            .then(() => next())
            .catch(err => next(err));
    };
}

export {
    typesafe,
    middleware,
    IMatch,
    SafeError
}