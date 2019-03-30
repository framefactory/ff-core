/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import Publisher, { ITypedEvent } from "./Publisher";

////////////////////////////////////////////////////////////////////////////////

/**
 * Subscribes to an event type on one or multiple publishers.
 * Subscription can be started and stopped for all registered publishers at once.
 */
export default class Subscriber<T extends ITypedEvent<string>>
{
    private _type: string;
    private _publishers: Publisher[];
    private _callback: (event: T) => void;

    private _context: any;
    private _isSubscribed: boolean;


    constructor(type: T["type"], callback: () => void, context?: any)
    {
        this._type = type;
        this._callback = callback;
        this._context = context;

        this._publishers = [];
        this._isSubscribed = false;
    }

    get isSubscribed() {
        return this._isSubscribed;
    }

    subscribe()
    {
        if (this._isSubscribed) {
            return;
        }

        this._isSubscribed = true;

        this._publishers.forEach(property => property.on(this._type, this._callback, this._context));

        return this;
    }

    unsubscribe()
    {
        if (!this._isSubscribed) {
            return;
        }

        this._isSubscribed = false;

        this._publishers.forEach(property => property.off(this._type, this._callback, this._context));

        return this;
    }

    add(...publishers: Publisher[])
    {
        publishers.forEach(publisher => {
            this._publishers.push(publisher);
            if (this._isSubscribed) {
                publisher.on(this._type, this._callback, this._context);
            }
        });

        return this;
    }

    remove(...publishers: Publisher[])
    {
        publishers.forEach(publisher => {
            this._publishers.splice(this._publishers.indexOf(publisher), 1);
            if (this._isSubscribed) {
                publisher.off(this._type, this._callback, this._context);
            }
        });

        return this;
    }

    clear()
    {
        if (this._isSubscribed) {
            this._publishers.forEach(publisher => publisher.off(this._type, this._callback, this._context));
        }

        this._publishers.length = 0;

        return this;
    }
}