import { TiledMap } from './TiledMap';
import tiledMapLoader from './tiledMapLoader';

declare global {
  namespace PIXI.extras {
    interface ITiledMap {
      TiledMap: TiledMap;
    }
  }
}

PIXI.Loader.shared.use(tiledMapLoader.call(PIXI.Loader.shared));

Object.assign(PIXI.extras, { TiledMap });

export default TiledMap;
