/**
 * FF Typescript Foundation Library
 * Copyright 2021 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

////////////////////////////////////////////////////////////////////////////////

const _pds = Symbol("provider dict");
const _cls = Symbol("consumer list");

export abstract class Consumer
{
    [_pds]: Record<string, Provider> = {};

    dispose()
    {
        const providers = this[_pds];
        if (providers) {
            for (const key in providers) {
                const consumers = providers[key][_cls];
                if (consumers) {
                    const i = consumers.indexOf(this);
                    if (i >= 0) consumers.splice(i, 1);
                }
            }
        }        
    }

    abstract update(provider: Provider): void;
}

export abstract class Provider extends Consumer
{
    [_cls]: Consumer[] = [];

    updated()
    {
        const consumers = this[_cls] || (this[_cls] = []);
        for (let i = 0, n = consumers.length; i < n; ++i) {
            consumers[i].update(this);
        } 
    }
}

export function provider()
{
    return function(proto: Consumer | Provider, name: string) {
        Object.defineProperty(proto, name, {
            get: function(): Provider {
                const providers = this[_pds];
                return providers ? providers[name] : undefined;
            },
            set: function(value: Provider) {
                const providers: Record<string, Provider> = this[_pds] || (this[_pds] = {});
                const old = providers[name];
                if (old) {
                    const consumers = old[_cls];
                    const i = consumers.indexOf(this);
                    if (i >= 0) consumers.splice(i, 1);
                }

                providers[name] = value;

                if (value) {
                    const consumers = value[_cls] || (value[_cls] = []);
                    consumers.push(this);
                }
            },
        });
    }    
}