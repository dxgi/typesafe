import { IMatch, SafeType } from './components/types';
import what from './components/what';
import { isNull, isNullOrEmpty } from './components/check';
import parseError from './components/parseError';
import { Request, Response, NextFunction } from 'express';

const _typesafe = (_path: string, schemas: any, input: any, array: boolean) => {
    return new Promise((resolve, reject) => {
        Object.keys(schemas).forEach(async (key) => {
            try {
                const schema = array ? schemas : schemas[key],
                    path = `${_path}.${key}`;

                if (!array && !input.hasOwnProperty(key))
                    throw parseError(path, 'empty');

                switch (what(schema)) {
                    case SafeType.string: {
                        const { min, max, custom } = array ? schemas : schema.string;

                        const value = array ? input : input[key];

                        if (isNullOrEmpty(value))
                            throw parseError(path, 'empty');

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
                        const { min, max, custom } = array ? schemas : schema.number;

                        const value = array ? input : input[key];

                        if (isNull(value))
                            throw parseError(path, 'empty');

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
                        const _schema = array ? schemas : schema.object,
                            _input = array ? input : input[key];

                        _typesafe(path, _schema, _input, false)
                            .catch(err => reject(err));
                        break;
                    }
                    case SafeType.array: {
                        const { min, max, items } = array ? schemas : schema.array;

                        const value = array ? input : input[key];

                        if (isNullOrEmpty(value))
                            throw parseError(path, 'empty');

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
                reject(err);
            }
        });
    });
}

export const typesafe = (schema: IMatch) => {
    return (input: any) => {
        return new Promise((resolve, reject) => {
            Object.keys(schema).forEach((key) => {
                const rule = (schema as any)[key];

                if (!input.hasOwnProperty(key))
                    return reject(new Error(`Couldn't resolve input.${key}`));

                _typesafe(key, rule, input[key], false)
                    .catch(err => reject(err));
            });
        });
    }
}

export const middleware = (schema: IMatch) => {
    return (req: Request, res: Response, next: NextFunction) => {
        typesafe(schema)(req)
            .then(() => next())
            .catch(err => next(err));
    };
}