/**
 * FF Typescript Foundation Library
 * Copyright 2022 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

const _pls = Symbol("provider linked");
const _pds = Symbol("provider dict");
const _cls = Symbol("consumer list");

export abstract class Consumer
{
    [_pds]: Record<string, Provider>;
    [_pls]: boolean;

    constructor()
    {
        this._initConsumer();
    }

    protected _initConsumer()
    {
        this[_pds] = {};
        this[_pls] = false;
    }

    protected _linkProviders()
    {
        this[_pls] = true;
        const providers = this[_pds];
        if (providers) {
            for (const key in providers) {
                const provider = providers[key];
                if (provider) {
                    const consumers = provider[_cls] || (provider[_cls] = []);
                    consumers.push(this);    
                }
            }
        } 
    }

    protected _unlinkProviders()
    {
        this[_pls] = false;
        const providers = this[_pds];
        if (providers) {
            for (const key in providers) {
                const provider = providers[key];
                if (provider) {
                    const consumers = provider[_cls];
                    if (consumers) {
                        const i = consumers.indexOf(this);
                        if (i >= 0) consumers.splice(i, 1);
                    }    
                }
            }
        }        
    }

    abstract onProviderUpdate(provider: Provider): void;
}

export abstract class Provider extends Consumer
{
    [_cls]: Consumer[] = [];

    onProviderUpdate(provider: Provider): void
    {
        provider;
        this.updated();
    }

    updated()
    {
        const consumers = this[_cls] || (this[_cls] = []);
        for (let i = 0, n = consumers.length; i < n; ++i) {
            consumers[i].onProviderUpdate(this);
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
            set: function(provider: Provider) {
                const providers: Record<string, Provider> = this[_pds] || (this[_pds] = {});
                if (this[_pls]) {
                    const old = providers[name];
                    if (old) {
                        const consumers = old[_cls];
                        const i = consumers.indexOf(this);
                        if (i >= 0) consumers.splice(i, 1);
                    }    
                }

                providers[name] = provider;

                if (provider && this[_pls]) {
                    const consumers = provider[_cls] || (provider[_cls] = []);
                    consumers.push(this);
                }
            },
        });
    }    
}