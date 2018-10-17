/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Dictionary } from "../types";
import { ILinkable } from "./PropertySet";

////////////////////////////////////////////////////////////////////////////////

/**
 * Sorts an array of [[ILinkable]] such that if a is linked to b, a comes before b.
 */
export default class LinkableSorter
{
    protected visited: Dictionary<boolean>;
    protected visiting: Dictionary<boolean>;
    protected sorted: ILinkable[];

    constructor()
    {
        this.visited = {};
        this.visiting = {};
        this.sorted = [];
    }

    sort(linkables: ILinkable[]): ILinkable[]
    {
        for (let i = 0, n = linkables.length; i < n; ++i) {
            this.visit(linkables[i]);
        }

        const sorted = this.sorted;

        this.visited = {};
        this.visiting = {};
        this.sorted = [];

        return sorted;
    }

    protected visit(linkable: ILinkable)
    {
        const visited = this.visited;
        const visiting = this.visiting;

        if (visited[linkable.id] || visiting[linkable.id]) {
            return;
        }

        visiting[linkable.id] = true;

        // for each output property, follow all outgoing links
        const outProps = linkable.outs.properties;
        for (let i0 = 0, n0 = outProps.length; i0 < n0; ++i0) {
            const outLinks = outProps[i0].outLinks;
            for (let i1 = 0, n1 = outLinks.length; i1 < n1; ++i1) {
                const ins = outLinks[i1].destination.props;

                // follow outgoing links at input properties
                const inProps = ins.properties;
                for (let i2 = 0, n2 = inProps.length; i2 < n2; ++i2) {
                    const links = inProps[i2].outLinks;
                    for (let i3 = 0, n3 = links.length; i3 < n3; ++i3) {
                        const linkedIns = links[i3].destination.props;
                        this.visit(linkedIns.linkable);
                    }
                }

                this.visit(ins.linkable);
            }
        }

        visiting[linkable.id] = undefined;
        visited[linkable.id] = true;

        this.sorted.unshift(linkable);
    }
}
