import { IMatch } from '../components/types';
import { typesafe, middleware } from '../index';

const schema: IMatch = {
    body: {
        test_1: {
            string: {
                min: 1,
                max: 10,
                custom: (value: string) => {
                    if (value.startsWith('error'))
                        throw new Error('[schema] test_1: string.custom: starts with "error"');
                    else if (value === 'reject')
                        return false;
                    
                    return true;
                }
            }
        },
        test_2: {
            number: {
                min: 1,
                max: 10
            }
        },
        test_3: {
            object: {
                test_3_1: {
                    string: {
                        min: 1,
                        max: 10
                    }
                }
            }
        },
        test_4: {
            array: {
                min: 1,
                max: 10,
                items: {
                    string: {
                        min: 1,
                        custom: (value: string) => {
                            if (!value.startsWith('https://'))
                                return false;

                            return true;
                        }
                    }
                }
            }
        }
    }
};

const input = {
    body: {
        test_1: 'reject',
        test_2: 10,
        test_3: {
            test_3_1: 'test'
        },
        test_4: [
            'https://google.com',
        ]
    }
};

typesafe(schema)(input)
    .then(() => console.log('OK'))
    .catch((err) => console.log(err.message));