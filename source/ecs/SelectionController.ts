/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import {
    System,
    ISystemComponentEvent,
    ISystemEntityEvent,
    Entity,
    Component
} from "./index";

import Controller, {
    Commander,
    Actions,
    IPublisherEvent
} from "../Controller";

////////////////////////////////////////////////////////////////////////////////

export type SelectionActions = Actions<SelectionController>;

export interface ISelectEntityEvent extends IPublisherEvent<SelectionController>
{
    entity: Entity;
    selected: boolean;
}

export interface ISelectComponentEvent extends IPublisherEvent<SelectionController>
{
    component: Component;
    selected: boolean;
}

export interface IControllerUpdateEvent extends IPublisherEvent<SelectionController>
{
}

export default class SelectionController extends Controller<SelectionController>
{
    static readonly selectEntityEvent = "entity";
    static readonly selectComponentEvent = "component";
    static readonly updateEvent = "update";

    multiSelect = false;
    exclusiveSelect = true;

    readonly system: System;
    readonly actions: SelectionActions;

    protected _selectedEntities: Set<Entity> = new Set();
    protected _selectedComponents: Set<Component> = new Set();

    constructor(system: System, commander: Commander)
    {
        super(commander);
        this.addEvents(
            SelectionController.selectEntityEvent,
            SelectionController.selectComponentEvent,
            SelectionController.updateEvent
        );

        this.system = system;
        this.actions = this.createActions(commander);

        system.on(System.entityEvent, this.onSystemEntity, this);
        system.on(System.componentEvent, this.onSystemComponent, this);
    }

    dispose()
    {
        this.system.off(System.entityEvent, this.onSystemEntity, this);
        this.system.off(System.componentEvent, this.onSystemComponent, this);
    }

    createActions(commander: Commander)
    {
        return {
            selectEntity: commander.register({
                name: "Select Entity", do: this.selectEntity, target: this
            }),
            selectComponent: commander.register({
                name: "Select Component", do: this.selectComponent, target: this
            })
        };
    }

    selectEntity(entity: Entity, toggle: boolean = false)
    {
        const selectedEntities = this._selectedEntities;
        const multiSelect = this.multiSelect && toggle;

        if (selectedEntities.has(entity)) {
            if (multiSelect) {
                selectedEntities.delete(entity);
                this.emitSelectEntityEvent(entity, false);
            }
        }
        else {
            if (this.exclusiveSelect) {
                for (let selectedComponent of this._selectedComponents) {
                    this.emitSelectComponentEvent(selectedComponent, false);
                }
                this._selectedComponents.clear();
            }
            if (!multiSelect) {
                for (let selectedEntity of selectedEntities) {
                    this.emitSelectEntityEvent(selectedEntity, false);
                }
                selectedEntities.clear();
            }
            selectedEntities.add(entity);
            this.emitSelectEntityEvent(entity, true);
        }
    }

    selectComponent(component: Component, toggle: boolean = false)
    {
        const selectedComponents = this._selectedComponents;
        const multiSelect = this.multiSelect && toggle;

        if (selectedComponents.has(component)) {
            if (multiSelect) {
                selectedComponents.delete(component);
                this.emitSelectComponentEvent(component, false);
            }
        }
        else {
            if (this.exclusiveSelect) {
                for (let selectedEntity of this._selectedEntities) {
                    this.emitSelectEntityEvent(selectedEntity, false);
                }
                this._selectedEntities.clear();
            }
            if (!multiSelect) {
                for (let selectedComponent of selectedComponents) {
                    this.emitSelectComponentEvent(selectedComponent, false);
                }
                selectedComponents.clear();
            }
            selectedComponents.add(component);
            this.emitSelectComponentEvent(component, true);
        }
    }

    protected emitSelectEntityEvent(entity: Entity, selected: boolean)
    {
        this.emit<ISelectEntityEvent>(
            SelectionController.selectEntityEvent, { entity, selected }
        );
    }

    protected emitSelectComponentEvent(component: Component, selected: boolean)
    {
        const event = { component, selected };
        this.emit<ISelectComponentEvent>(SelectionController.selectComponentEvent, event);
        this.system.emitComponentEvent(component, SelectionController.selectEntityEvent, event);
    }

    protected onSystemEntity(event: ISystemEntityEvent)
    {
        if (event.remove && this._selectedEntities.has(event.entity)) {
            this.selectEntity(event.entity, false);
        }

        this.emit<IControllerUpdateEvent>(SelectionController.updateEvent);
    }

    protected onSystemComponent(event: ISystemComponentEvent)
    {
        if (event.remove && this._selectedComponents.has(event.component)) {
            this.selectComponent(event.component, false);
        }

        this.emit<IControllerUpdateEvent>(SelectionController.updateEvent);
    }
}