import path from 'path';
import * as PIXI from 'pixi.js';
import ImageLayer from './ImageLayer';
import TileLayer from './TileLayer';
import TileSet from './TileSet';

export class TiledMap extends PIXI.Container {

  public resourceUrl: string;
  public loader: PIXI.Loader;
  public tileSets: TileSet[] = [];
  public layers: {[index: string]: TileLayer} = {};
  public background = new PIXI.Graphics();
  // tslint:disable-next-line:variable-name
  public _width?: number;
  public tileWidth: number = 0;
  // tslint:disable-next-line:variable-name
  public _height?: number;
  public tileHeight: number = 0;

  constructor(loader: PIXI.Loader, resourceUrl: string) {
    super();
    this.loader = loader;
    this.resourceUrl = resourceUrl;
    this.create();
  }

  public create() {
    const route = path.dirname(this.loader.resources[this.resourceUrl].url);
    const data: ITMXData = this.loader.resources[this.resourceUrl].data;

    Object.assign(this, data);

    this.background.beginFill(0x000000, 0);
    this.background.drawRect(
      0,
      0,
      (this._width || 0) * (this.tileWidth || 0),
      (this._height || 0) * (this.tileHeight || 0),
    );
    this.background.endFill();
    this.addChild(this.background);

    data.tileSets.forEach(tileSet => {
      const tilesetRoot = path.join(route, path.dirname(tileSet.source));

      this.tileSets.push(
        new TileSet(tilesetRoot, tileSet),
      );
    });

    data.layers.forEach(layerData => {
      switch (layerData.type) {
        case 'tile': {
          const tileLayer = new TileLayer(layerData, this.tileSets);
          this.layers[layerData.name] = tileLayer;
          this.addChild(tileLayer);
          break;
        }
        case 'image': {
          const imageLayer = new ImageLayer(layerData, route);
          this.layers[layerData.name] = imageLayer as TileLayer;
          this.addChild(imageLayer);
          break;
        }
      }
    });
  }
}
