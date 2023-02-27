interface IBasic {
    min: number;
    max?: number;
}

interface IStringWithCustom extends IBasic {
    custom: (value: string) => Promise<boolean> | boolean;
}

interface INumberBasic extends IBasic {
    bigInt: boolean;
}

interface INumberWithCustom extends INumberBasic {
    custom: (value: number) => Promise<boolean> | boolean;
}

interface IArrayWithItems extends IBasic {
    items: IRule;    
}

type IString = IBasic | IStringWithCustom;

type INumber = IBasic | INumberBasic | INumberWithCustom;

type IArray = IBasic | IArrayWithItems;

type IBoolean = boolean;

enum SafeType {
    string = 'string',
    number = 'number',
    object = 'object',
    array = 'array',
    boolean = 'boolean'
}

type IRule = {
    string?: IString;
} | {
    number?: INumber;
} | {
    object?: IObject
} | {
    array?: IArray;
} | {
    boolean?: IBoolean;
};

type IObject = {
    [key: string]: IRule;
}

interface IMatchWithBody {
    body?: {
        [key: string]: IRule;
    }
}

interface IMatchWithParams {
    params?: {
        [key: string]: IRule;
    }
}

interface IMatchWithQuery {
    query?: {
        [key: string]: IRule;
    }
}

interface IMatchWithAny {
    [key: string]: {
        [key: string]: IRule;
    }
}

type IMatch = IMatchWithAny | IMatchWithBody | IMatchWithParams | IMatchWithQuery;

export { IMatch, SafeType, IString, INumber, IObject, IArray, IBoolean };