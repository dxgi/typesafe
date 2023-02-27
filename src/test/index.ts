import { typesafe, IMatch } from '../index';

const schema: IMatch = {
    body: {
        data: {
            object: {
                name: {
                    string: {
                        min: 5,
                        max: 10
                    }
                }
            }
        },
        dataset: {
            array: {
                min: 1,
                max: 5,
                items: {
                    object: {
                        name: {
                            string: {
                                min: 5,
                                custom: (value: string) => {
                                    return value === 'Johnathan';
                                }
                            }
                        },
                        list: {
                            array: {
                                min: 5,
                                items: {
                                    number: {
                                        min: 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const input = {
    body: {
        data: {
            name: 'Johnathan'
        },
        dataset: [
            {
                name: 'Johnathan',
                list: [
                    1, 2, 3, 4, 5
                ]
            }
        ]
    }
};

typesafe(schema)(input)
    .then(() => console.log('OK'))
    .catch((err) => console.log(err.message));