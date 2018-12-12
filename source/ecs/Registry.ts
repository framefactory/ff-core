/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary, TypeOf } from "../types";

import Component, { ComponentType } from "./Component";
import Entity from "./Entity";

////////////////////////////////////////////////////////////////////////////////

/**
 * Registry for component types. Each component type should register itself
 * with the registry. The registry is used to construct subtypes of components
 * during inflation (de-serialization) of entity-component systems.
 */
export default class Registry
{
    types: Dictionary<TypeOf<Component>>;

    constructor()
    {
        this.types = {};
    }

    createComponent<T extends Component>(type: string, entity: Entity, instanceId?: string): T
    {
        const componentType = this.getComponentType(type) as ComponentType<T>;
        return Component.create(componentType, entity, instanceId);
    }

    getComponentType<T extends Component>(type: string): TypeOf<T>
    {
        const componentType = this.types[type] as TypeOf<T>;
        if (!componentType) {
            throw new Error(`component type not found for type id: '${type}'`);
        }

        return componentType;
    }

    registerComponentType(componentType: ComponentType | ComponentType[])
    {
        if (Array.isArray(componentType)) {
            componentType.forEach(componentType => this.registerComponentType(componentType));
        }
        else {
            if (this.types[componentType.type]) {
                console.warn(componentType);
                throw new Error(`component type already registered: '${componentType.type}'`);
            }

            this.types[componentType.type] = componentType;
        }
    }
}
