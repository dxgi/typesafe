
# @imaximus/typesafe

Introducing \"typesafe\", an npm package providing object-oriented type safety for Express and general usage.
## Installation

Install @imaximus/typesafe with yarn

```bash
yarn add @imaximus/typesafe
```
    
## General Usage

[test/index.ts](https://github.com/dxgi/typesafe/blob/master/src/test/index.ts)

```typescript
import { typesafe, IMatch } from '@imaximus/typesafe';

const schema: IMatch = {
    body: {
        name: {
            string: {
                min: 1,
                max: 15,
                custom: (value: string) => {
                    if (value === 'reject')
                        return false;
                    else if value === 'error')
                        throw new Error('error');

                    return true;
                } 
            }
        }
    }
};

const input = {
    body: {
        name: 'Hello World!'
    }
};

typesafe(schema)(input)
    .then(() => console.log('OK'))
    .catch(err => console.error(err.message));
```
## Middleware Usage

```typescript
import { Request, Response, NextFunction } from 'express';
import { middleware, IMatch } from '@imaximus/typesafe';

const app = ...;

const schema: IMatch = {
    ...
}

app.post('/', middleware(schema), ...);
```
