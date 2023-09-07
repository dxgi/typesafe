import { typesafe, IMatch } from '../index';

const schema: IMatch = {
    body: {
        data: {
            object: {
                name: {
                    string: {
                        min: 5,
                        max: 10,
                        nullable: true
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
                                nullable: false,
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
                },
                nullable: true
            }
        }
    }
};

const input = {
    body: {
        data: {
            name: null
        },
        dataset: [
            {
                name: 'Not Johnathan',
                list: [
                    0, 1, 2, 3, 4, 5
                ]
            }
        ]
    }
};

typesafe(schema)(input)
    .then(() => console.log('OK'))
    .catch((err) => console.log(err.message));