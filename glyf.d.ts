declare type AppConfig = {
    samples: string[];
}
declare type SVGOptions = {
    showPoints: boolean;
    showPolygon: boolean;
    loopAnimation: boolean;
    speed: number;
};
declare type point = {
    _x: number;
    _y: number;
    _type?: string;
    _smooth?: string;
}

declare type contour = {
    point: point[];
}

declare type component = {
    base: string;
    xOffset: number;
}

declare type outline = {
    contour: contour[];
    component: component[];
}

declare type unicode = {
    _hex: string;
}

declare type advance = {
    _width: number;
}

declare type glyph = {
    _format: string;
    name: string;
    advance: advance;
    unicode: unicode;
    outline: outline;
}
declare type root = {
    glyph: glyph;
}