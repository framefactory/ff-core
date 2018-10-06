/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

export interface IColorHSL
{
    hue: number,
    saturation: number,
    luminance: number,
    alpha?: number
}

export default class Color
{
    static fromString(color: string): Color
    {
        return (new Color()).setString(color);
    }

    static fromHSL(hue: number | IColorHSL, saturation: number = 1, luminance: number = 1): Color
    {
        return (new Color()).setHSL(hue, saturation, luminance)
    }

    "0": number;
    "1": number;
    "2": number;
    "3": number;

    length: 4;

    constructor(red: number | number[] | string | Color = 0, green: number = 0, blue: number = 0, alpha: number = 1)
    {
        if (typeof red === "object" && (red instanceof Color || Array.isArray(red))) {
            this[0] = red[0];
            this[1] = red[1];
            this[2] = red[2];
            this[3] = red[3];
        }
        else if (typeof red === "string") {
            this.setString(red);
        }
        else {
            this[0] = red;
            this[1] = green;
            this[2] = blue;
            this[3] = alpha;
        }
    }

    get red(): number { return this[0]; }
    get green(): number { return this[1]; }
    get blue(): number { return this[2]; }
    get alpha(): number { return this[3]; }

    set red(value: number) { this[0] = value; }
    set green(value: number) { this[1] = value; }
    set blue(value: number) { this[2] = value; }
    set alpha(value: number) { this[3] = value; }

    get redByte(): number { return Math.floor(this[0] * 255); }
    get greenByte(): number { return Math.floor(this[1] * 255); }
    get blueByte(): number { return Math.floor(this[2] * 255); }
    get alphaByte(): number { return Math.floor(this[3] * 255); }

    set redByte(value: number) { this[0] = value / 255.0; }
    set greenByte(value: number) { this[1] = value / 255.0; }
    set blueByte(value: number) { this[2] = value / 255.0; }
    set alphaByte(value: number) { this[3] = value / 255.0; }

    clone() : Color
    {
        return new Color(this[0], this[1], this[2], this[3]);
    }
    
    set(red: number, green: number, blue: number, alpha?: number)
    {
        this[0] = red;
        this[1] = green;
        this[2] = blue;
        this[3] = alpha === undefined ? 1 : alpha;
    }

    setBytes(red: number, green: number, blue: number, alpha?: number)
    {
        this[0] = red / 255;
        this[1] = green / 255;
        this[2] = blue / 255;
        this[3] = alpha === undefined ? 1 : alpha / 255;
    }

    setRed(red: number) : Color
    {
        this[0] = red;
        return this;
    }

    setGreen(green: number) : Color
    {
        this[1] = green;
        return this;
    }

    setBlue(blue: number) : Color
    {
        this[2] = blue;
        return this;
    }

    setAlpha(alpha: number) : Color
    {
        this[3] = alpha;
        return this;
    }

    setRedByte(red: number) : Color
    {
        this[0] = red / 255;
        return this;
    }

    setGreenByte(green: number) : Color
    {
        this[1] = green / 255;
        return this;
    }

    setBlueByte(blue: number) : Color
    {
        this[2] = blue / 255;
        return this;
    }

    setAlphaByte(alpha: number) : Color
    {
        this[3] = alpha / 255;
        return this;
    }

    setString(color: string, alpha: number = 1): Color
    {
        color = color.trim().toLowerCase();
        color = Color.presets[color] || color;

        let result = color.match(/^#([0-9a-f]{3})$/i);
        if(result) {
            const text = result[1];
            const factor = 1 / 15;
            this[0] = Number.parseInt(text.charAt(0), 16) * factor;
            this[1] = Number.parseInt(text.charAt(1), 16) * factor;
            this[2] = Number.parseInt(text.charAt(2), 16) * factor;
            this[3] = alpha;
            return this;
        }

        result = color.match(/^#([0-9a-f]{6})$/i);
        if(result) {
            const text = result[1];
            const factor = 1 / 255;
            this[0] = Number.parseInt(text.substr(0,2), 16) * factor;
            this[1] = Number.parseInt(text.substr(2,2), 16) * factor;
            this[2] = Number.parseInt(text.substr(4,2), 16) * factor;
            this[3] = alpha;
            return this;
        }

        if (color.indexOf("rgb") === 0) {
            let result : any = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
            if(result) {
                const factor = 1 / 255;
                this[0] = Number.parseInt(result[1]) * factor;
                this[1] = Number.parseInt(result[2]) * factor;
                this[2] = Number.parseInt(result[3]) * factor;
                this[3] = alpha;
                return this;
            }

            result = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i);
            if(result) {
                const factor = 1 / 255;
                this[0] = Number.parseInt(result[1]) * factor;
                this[1] = Number.parseInt(result[2]) * factor;
                this[2] = Number.parseInt(result[3]) * factor;
                this[3] = Number.parseFloat(result[4]);
                return this;
            }
        }

        if (color.indexOf("hsl") === 0) {
            let result: any = color.match(/(\d+(\.\d+)?)/g);
            if (result) {
                this.setHSL(
                    Number.parseFloat(result[0]),
                    Number.parseFloat(result[1]) * 0.01,
                    Number.parseFloat(result[2]) * 0.01,
                    result[3] !== undefined ? Number.parseFloat(result[3]) : alpha
                );
            }
            return this;
        }

        throw new RangeError("failed to parse color from string: " + color);
    }

    toInt(): number
    {
        return Math.floor(this[0] * 255) << 16
            + Math.floor(this[1] * 255) << 8
            + Math.floor(this[2] * 255);
    }

    toString(): string
    {
        const alpha = this[3];

        if (alpha < 1) {
            return `rgba(${this.redByte}, ${this.greenByte}, ${this.blueByte}, ${alpha})`;
        }
        else {
            const value = (1 << 24) + (this.redByte << 16) + (this.greenByte << 8) + this.blueByte;
            return `#${value.toString(16).slice(1)}`;
        }
    }

    setHSL(hue: number | IColorHSL, saturation: number = 1, luminance: number = 1, alpha: number = 1): Color
    {
        if (typeof hue === "object") {
            luminance = hue.luminance;
            saturation = hue.saturation;
            alpha = hue.alpha !== undefined ? hue.alpha : alpha;
            hue = hue.hue;
        }

        if (saturation === 0) {
            this[0] = this[1] = this[2] = luminance;
        }
        else {
            hue /= 360;

            let t2 = luminance < 0.5 ? luminance * (1 + saturation) : luminance + saturation - luminance * saturation;
            let t1 = 2 * luminance - t2;
            let t3, val;

            for (let i = 0; i < 3; ++i) {
                t3 = hue + 1 / 3 * (1 - i);
                t3 < 0 && t3++;
                t3 > 1 && t3--;
                if (6 * t3 < 1)
                    val= t1 + (t2 - t1) * 6 * t3;
                else if (2 * t3 < 1)
                    val= t2;
                else if (3 * t3 < 2)
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                else
                    val= t1;
                this[i] = val;
            }
        }

        this[3] = alpha;

        return this;
    }

    toHSL(): IColorHSL
    {
        let r = this[0],
            g = this[1],
            b = this[2];

        let min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            d = max - min,
            h = 0, s = 0, l = (min + max) / 2;

        if (d != 0) {
            s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
            h = (r == max ? (g - b) / d : g == max ? 2 + (b - r) / d : 4 + (r - g) / d) * 60;
        }

        return { hue: h, saturation: s, luminance: l };
    }

    inverseMultiply(factor: number): Color
    {
        this[0] = this[0] * (1 - factor) + factor;
        this[1] = this[1] * (1 - factor) + factor;
        this[2] = this[2] * (1 - factor) + factor;

        return this;
    }

    multiply(factor: number): Color
    {
        this[0] *= factor;
        this[1] *= factor;
        this[2] *= factor;

        return this;
    }

    private static presets = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgrey": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkslategrey": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dimgrey": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "grey": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgray": "#d3d3d3",
        "lightgrey": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightslategrey": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370db",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#db7093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "rebeccapurple": "#663399",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "slategrey": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    }
}