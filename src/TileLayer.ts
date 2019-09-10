import * as PIXI from 'pixi.js';
import Tile from './Tile';
import TileSet from './TileSet';

export default class TileLayer extends PIXI.Container {

  private static findTileSet(gid: number, tileSets: TileSet[]) {
    let tileset;
    for (let i = tileSets.length - 1; i >= 0; i--) {
      tileset = tileSets[i];
      if (tileset.firstGid && tileset.firstGid <= gid) {
        break;
      }
    }
    return tileset;
  }

  public layer: ILayerData;
  public tileSets: TileSet[];
  public tiles: Tile[];

  constructor(layer: ILayerData, tileSets: TileSet[]) {
    super();

    this.layer = layer;
    this.tileSets = tileSets;
    this.alpha = layer.opacity;
    this.tiles = [];

    Object.assign(this, layer);

    this.create();
  }

  public create() {
    for (let y = 0; y < this.layer.map.height; y++) {
      for (let x = 0; x < this.layer.map.width; x++) {
        const i = x + (y * this.layer.map.width);

        if (this.layer.tiles[i] && this.layer.tiles[i].gid && this.layer.tiles[i].gid !== 0) {

          const tileset = TileLayer.findTileSet(this.layer.tiles[i].gid, this.tileSets);

          if (tileset) {
            const tile = new Tile(
              this.layer.tiles[i],
              tileset,
              this.layer.horizontalFlips[i],
              this.layer.verticalFlips[i],
              this.layer.diagonalFlips[i],
            );

            tile.x = x * this.layer.map.tileWidth;
            tile.y = y * this.layer.map.tileHeight +
              (this.layer.map.tileHeight - (tile.textures[0] as PIXI.Texture).height);

            tile._x = x;
            tile._y = y;

            if (tileset.tileOffset) {
              tile.x += tileset.tileOffset.x;
              tile.y += tileset.tileOffset.y;
            }

            if (tile.textures.length > 1) {
              tile.animationSpeed = 1000 / 60 / tile.animations[0].duration;
              tile.gotoAndPlay(0);
            }

            this.tiles.push(tile);

            this.addChild(tile);
          }
        }
      }
    }
  }
}
