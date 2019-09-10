declare module "ImageLayer" {
    import * as PIXI from 'pixi.js';
    export default class ImageLayer extends PIXI.Container {
        constructor(layer: ILayerData, route: string);
    }
}
declare module "TileSet" {
    import * as PIXI from 'pixi.js';
    export default class TileSet {
        firstGid: number;
        baseTexture: PIXI.Texture;
        textures: PIXI.Texture[];
        margin: number;
        spacing: number;
        tileHeight: number;
        tileWidth: number;
        image: {
            source: string;
            height: number;
            width: number;
        };
        tileOffset?: {
            x: number;
            y: number;
        };
        constructor(route: string, tileSet: ITileSetData);
    }
}
declare module "Tile" {
    import * as PIXI from 'pixi.js';
    import TileSet from "TileSet";
    export default class Tile extends PIXI.AnimatedSprite {
        private static getTextures;
        animations: IAnimation[];
        gid: number;
        _x: number;
        _y: number;
        tile: ITileData;
        tileSet: TileSet;
        horizontalFlip: boolean;
        verticalFlip: boolean;
        diagonalFlip: boolean;
        constructor(tile: ITileData, tileSet: TileSet, horizontalFlip: boolean, verticalFlip: boolean, diagonalFlip: boolean);
        private flip;
    }
}
declare module "TileLayer" {
    import * as PIXI from 'pixi.js';
    import Tile from "Tile";
    import TileSet from "TileSet";
    export default class TileLayer extends PIXI.Container {
        private static findTileSet;
        layer: ILayerData;
        tileSets: TileSet[];
        tiles: Tile[];
        constructor(layer: ILayerData, tileSets: TileSet[]);
        create(): void;
    }
}
declare module "TiledMap" {
    import * as PIXI from 'pixi.js';
    import TileLayer from "TileLayer";
    import TileSet from "TileSet";
    export class TiledMap extends PIXI.Container {
        resourceUrl: string;
        loader: PIXI.Loader;
        tileSets: TileSet[];
        layers: {
            [index: string]: TileLayer;
        };
        background: PIXI.Graphics;
        _width?: number;
        tileWidth: number;
        _height?: number;
        tileHeight: number;
        constructor(loader: PIXI.Loader, resourceUrl: string);
        create(): void;
    }
}
declare module "tiledMapLoader" {
    import * as PIXI from 'pixi.js';
    function tileMapLoader(this: PIXI.Loader): (resource: PIXI.LoaderResource, next: () => void) => void;
    export default tileMapLoader;
}
declare module "index" {
    import { TiledMap } from "TiledMap";
    import tiledMapLoader from "tiledMapLoader";
    const _default: {
        TiledMap: typeof TiledMap;
        tiledMapLoader: typeof tiledMapLoader;
    };
    export default _default;
}
interface ITMXData {
    version: string;
    orientation: string;
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    backgroundColor?: string;
    layers: ILayerData[];
    properties: {};
    tileSets: ITileSetData[];
}
interface ILayerData {
    map: ITMXData;
    type: string;
    name: string;
    image?: {
        format?: string;
        height: number;
        source: string;
        trans?: boolean;
        width: number;
    };
    opacity: number;
    visible: boolean;
    properties: {};
    tiles: ITileData[];
    horizontalFlips: boolean[];
    verticalFlips: boolean[];
    diagonalFlips: boolean[];
}
interface ITileSetData {
    firstGid: number;
    source: string;
    name: string;
    tileWidth: number;
    tileHeight: number;
    spacing?: number;
    margin?: number;
    tileOffset: {
        x: number;
        y: number;
    };
    properties: {};
    image: {
        format?: string;
        height: number;
        source: string;
        trans?: boolean;
        width: number;
    };
    tiles: ITileData[];
    terrainTypes: [];
}
interface ITileData {
    animations: IAnimation[];
    gid: number;
    id: number;
    image?: {
        format?: string;
        height: number;
        source: string;
        trans?: boolean;
        width: number;
    };
    objectGroups: [];
    probability?: number;
    properties: {};
    terrain: [];
}
interface IAnimation {
    tileId: number;
    duration: number;
}
