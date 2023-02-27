import { SafeType } from './types';

const what = (schema: any) => {
    if (schema.string)
        return SafeType.string;
    else if (schema.number)
        return SafeType.number;
    else if (schema.object)
        return SafeType.object;
    else if (schema.array)
        return SafeType.array;
    else if (schema.boolean)
        return SafeType.boolean;
    else
        throw new Error("Couldn't resolve type");
}

export default what;