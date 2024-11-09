/**
 * FF Typescript Foundation Library
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

const _pd = Symbol("Publisher private data");
const _strict = Symbol("Publisher strict option");

/**
 * Base class for bubbling events
 */
export interface IPropagatingEvent<T extends string> extends ITypedEvent<T>
{
    stopPropagation: boolean;
}

/**
 * Base class for typed events. Typed events have a type property holding the name of the event.
 * @event
 */
export interface ITypedEvent<T extends string>
{
    /** The type name of the event. */
    type: T;
}

/**
 * Provides subscription services for events.
 */
export class Publisher
{
    /**
     * Constructs a new [[Publisher]] instance.
     * @param options knownEvents: if true, only known, i.e. previously added event types can be emitted. Default is true.
     */
    constructor(options?: { knownEvents: boolean })
    {
        const knownEvents = options ? options.knownEvents : true;
        this[_pd] = { [_strict]: knownEvents };
    }

    /**
     * Subscribes to an event.
     * @param type Type name of the event or an array of type names of events.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    on<T extends ITypedEvent<string>>(type: T["type"] | T["type"][], callback: (event: T) => void, context?: any): void;
    on(type: string | string[] | Record<string, any>, callback: (event: any) => void, context?: any): void;
    on(type, callback, context?)
    {
        if (Array.isArray(type)) {
            type.forEach(type => {
                this.on(type, callback, context);
            });

            return;
        }

        if (!callback) {
            throw new Error("missing callback function");
        }

        let subscribers = this[_pd][type];
        if (!subscribers) {
            if (this[_pd][_strict]) {
                throw new Error(`can't subscribe; unknown event: '${type}'`);
            }

            subscribers = this[_pd][type] = [];
        }

        const subscriber = { callback, context };
        subscribers.push(subscriber);
    }

    /**
     * Subscribes to an event. You may find using the .on() method more handy and more flexible.
     * @param type
     * @param callback
     * @param context
     */
    addEventListener(type: string, callback: (event: unknown) => void, context?: unknown): void
    {
        this.on(type, callback, context);
    }

    /**
     * One-time subscription to an event. As soon as the event is emitted, the subscription is cancelled.
     * @param type Type name of the event or an array of type names of events.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    once<T extends ITypedEvent<string>>(type: T["type"] | T["type"][], callback: (event: T) => void, context?: any): void;
    once(type: string | string[] | Record<string, any>, callback: (event: any) => void, context?: any): void;
    once(type, callback, context?)
    {
        if (Array.isArray(type)) {
            type.forEach(type => {
                this.once(type, callback, context);
            });

            return;
        }

        const redirect: any = event => {
            this.off(type, redirect, context);
            callback.call(context, event);
        };

        redirect.cb = callback;

        this.on(type, redirect, context);
    }

    /**
     * Unsubscribes from an event.
     * @param type Type name of the event, or an array of type names of events.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    off<T extends ITypedEvent<string>>(type: T["type"] | T["type"][], callback?: (event: T) => void, context?: any): void;
    off(type: string | string[] | Record<string, any>, callback?: (event: any) => void, context?: any): void;
    off(type, callback?, context?)
    {
        if (typeof type === "object") {

            if (Array.isArray(type)) {
                // if first parameter is an array, call function for all elements of the array
                type.forEach((type) => {
                    this.off(type, callback, context);
                });
            }
            else {
                // if first parameter is an object, unsubscribe all subscriptions where the context matches the object.
                const events = this[_pd];
                const types = Object.keys(events);

                for (let i = 0, ni = types.length; i < ni; ++i) {
                    const subscribers = events[type];
                    const remainingSubscribers = [];
                    for (let j = 0, nj = subscribers.length; j < nj; ++j) {
                        const subscriber = subscribers[j];
                        if (type && subscriber.context !== type) {
                            remainingSubscribers.push(subscriber);
                        }
                    }
                    events[type] = remainingSubscribers;
                }
            }

            return;
        }

        const subscribers = this[_pd][type];
        if (!subscribers) {
            throw new Error(`can't unsubscribe; unknown event type: '${type}'`);
        }

        const remainingSubscribers = [];
        for (let i = 0, n = subscribers.length; i < n; ++i) {
            const subscriber = subscribers[i];
            if ((callback && callback !== subscriber.callback && callback !== subscriber.callback.cb)
                || (context && context !== subscriber.context)) {
                remainingSubscribers.push(subscriber);
            }
        }
        this[_pd][type] = remainingSubscribers;
    }

    /**
     * Unsubscribes from an event. You may find using the .off() method more handy and more flexible.
     * @param type Type name of the event.
     * @param callback Callback function, invoked when the event is emitted.
     * @param context Optional: this context for the callback invocation.
     */
    removeEventListener(type: string, callback?: (event: unknown) => void, context?: unknown): void
    {
        this.off(type, callback, context);
    }

    /**
     * Emits an event with the given message to all subscribers of the event type.
     * @param type Type name of the event.
     * @param message The object sent to the subscribers of the event type.
     */
    emit(type: string, message?: unknown): void;
    /**
     * Emits an event to all subscribers of the event's type.
     * @param event The event object sent to the subscribers of the event's type.
     */
    emit<T extends ITypedEvent<string>>(event: T): void;
    emit(eventOrType, message?)
    {
        let type, payload;
        if (typeof eventOrType === "string") {
            type = eventOrType;
            payload = message;
        }
        else {
            type = eventOrType.type;
            payload = eventOrType;
        }

        if (!type) {
            throw new Error(`empty or invalid event type: '${type}'`);
        }

        const data = this[_pd];
        const subscribers = data[type];

        if (!subscribers) {
            if (data[_strict]) {
                throw new Error(`can't emit; unknown event type: '${type}'`);
            }

            return;
        }

        for (let i = 0, n = subscribers.length; i < n; ++i) {
            const subscriber = subscribers[i];
            if (subscriber.context) {
                subscriber.callback.call(subscriber.context, payload);
            }
            else {
                subscriber.callback(payload);
            }
        }
    }

    /**
     * Registers a new event type.
     * @param name Name of the event type.
     */
    addEvent(name: string): void
    {
        if (!this[_pd][name]) {
            this[_pd][name] = [];
        }
    }

    /**
     * Registers multiple new event types.
     * @param names Names of the event types.
     */
    addEvents(...names: string[]): void
    {
        names.forEach(name => {
            if (!this[_pd][name]) {
                this[_pd][name] = [];
            }
        });
    }

    /**
     * Tests whether an event type has been registered.
     * @param name Name of the event type.
     * @returns true if an event type with the given name has been added.
     */
    hasEvent(name: string): boolean
    {
        return !!this[_pd][name];
    }

    /**
     * Lists all registered event types.
     * @returns an array with the names of all added event types.
     */
    listEvents(): string[]
    {
        return Object.getOwnPropertyNames(this[_pd]);
    }
}