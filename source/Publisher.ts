/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Subtract } from "./types";

////////////////////////////////////////////////////////////////////////////////

const _pd = Symbol("Publisher private data");
const _strict = Symbol("Publisher strict option");

/**
 * @event
 */
export interface IPublisherEvent<T>
{
    /** The sender this event originates from. */
    sender: T;
}

/**
 * Provides subscription services for events.
 */
export default class Publisher<T>
{
    constructor(options?: { knownEvents: boolean })
    {
        const knownEvents = options ? options.knownEvents : true;
        this[_pd] = { [_strict]: knownEvents };
    }

    /**
     * Subscribes to an event.
     * @param {string | string[]} name Name of the event.
     * @param {function} callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    on(name: string | string[], callback: (event: any) => void, context?: any)
    {
        if (Array.isArray(name)) {
            name.forEach(name => {
                this.on(name, callback, context);
            });

            return;
        }

        let subscribers = this[_pd][name];
        if (!subscribers) {
            if (this[_pd][_strict]) {
                throw new Error(`can't subscribe to unknown event: '${name}'`);
            }

            subscribers = this[_pd][name] = [];
        }

        let subscriber = { callback, context };
        subscribers.push(subscriber);
    }

    /**
     * One-time subscription to an event. As soon as the event is emitted, the subscription is cancelled.
     * @param {string | string[]} name Name of the event.
     * @param {function} callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    once(name: string | string[], callback: (event: any) => void, context?: any)
    {
        if (Array.isArray(name)) {
            name.forEach(name => {
                this.once(name, callback, context);
            });

            return;
        }

        const redirect: any = event => {
            this.off(name, redirect, context);
            callback.call(context, event);
        };

        redirect.cb = callback;

        this.on(name, redirect, context);
    }

    /**
     * Unsubscribes from an event.
     * @param {string | string[]} name Name of the event.
     * @param {function} callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    off(name: string | string[], callback?: (event: any) => void, context?: any)
    {
        if (Array.isArray(name)) {
            name.forEach((name) => {
                this.off(name, callback, context);
            });

            return;
        }

        let subscribers = this[_pd][name];
        if (!subscribers) {
            throw new Error(`can't unsubscribe from unknown event: '${name}'`);
        }

        let remainingSubscribers = [];
        subscribers.forEach((subscriber) => {
            if ((callback && callback !== subscriber.callback && callback !== subscriber.callback.cb)
                || (context && context !== subscriber.context)) {
                remainingSubscribers.push(subscriber);
            }
        });

        this[_pd][name] = remainingSubscribers;
    }

    /**
     * Emits an event to all subscribers. The event object is derived from
     * [[IPublisherEvent]]. The property *sender* can be omitted, in which case
     * it is added automatically and set to *this*.
     * @param name Name of the event.
     * @param event The event instance to be emitted.
     */
    emit<E extends IPublisherEvent<T>>(name: string, event?: Subtract<E, IPublisherEvent<T>>)
    {
        let subscribers = this[_pd][name];
        if (!subscribers) {
            if (this[_pd][_strict]) {
                throw new Error(`can't emit unknown event: "${name}"`);
            }

            return;
        }

        if (subscribers.length > 0) {
            let pubEvent: any = event;

            if (!pubEvent) {
                pubEvent = { sender: this };
            }
            else if (!pubEvent.sender) {
                pubEvent.sender = this;
            }

            for (let i = 0, n = subscribers.length; i < n; ++i) {
                const subscriber = subscribers[i];
                if (subscriber.context) {
                    subscriber.callback.call(subscriber.context, pubEvent);
                }
                else {
                    subscriber.callback(pubEvent);
                }
            }
        }
    }

    /**
     * Emits an event to all subscribers. Accepts arbitrary event data.
     * @param name Name of the event.
     * @param event The event data to be sent.
     */
    emitAny(name: string, event: any)
    {
        const subscribers = this[_pd][name];
        if (subscribers && subscribers.length > 0) {
            for (let i = 0, n = subscribers.length; i < n; ++i) {
                const subscriber = subscribers[i];
                if (subscriber.context) {
                    subscriber.callback.call(subscriber.context, event);
                }
                else {
                    subscriber.callback(event);
                }
            }
        }
    }

    /**
     * Adds a new event type.
     * @param name Name of the event type.
     */
    addEvent(name: string)
    {
        if (!this[_pd][name]) {
            this[_pd][name] = [];
        }
    }

    /**
     * Adds multiple new event types.
     * @param names Names of the event types.
     */
    addEvents(...names: string[])
    {
        names.forEach(name => {
            if (!this[_pd][name]) {
                this[_pd][name] = [];
            }
        });
    }

    /**
     * Tests whether an event type has been added.
     * @param name Name of the event type.
     * @returns true if an event type with the given name has been added.
     */
    hasEvent(name: string): boolean
    {
        return !!this[_pd][name];
    }

    /**
     * Lists all added event types.
     * @returns an array with the names of all added event types.
     */
    listEvents(): string[]
    {
        return Object.getOwnPropertyNames(this[_pd]);
    }
}