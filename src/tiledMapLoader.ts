import path from 'path';
import * as PIXI from 'pixi.js';
import * as tmx from 'tmx-parser';

// @ts-ignore
tmx.readFile = function readFile(name, cb) {
  // FIXME: figure out how we can load files without having to use fetch
  //  and also without this explicit mapping from src to public
  const targetURL = name.replace('src/', 'public/');
  fetch(targetURL).then((response) => {
    response.text().then(data => {
      cb(null, data);
    });
  }).catch((err) => {
    cb(err);
  });
};

function tileMapLoader(this: PIXI.Loader) {
  return (resource: PIXI.LoaderResource, next: () => void) => {
    if (
      !resource.data ||
      // @ts-ignore
      resource.type !== PIXI.LoaderResource.TYPE.XML ||
      !resource.data.children[0].getElementsByTagName('tileset')) {
      return next();
    }

    const route = path.dirname(resource.url.replace(this.baseUrl, ''));

    const loadOptions = {
      crossOrigin: resource.crossOrigin,
      parentResource: resource,
    };

    if (resource.xhr === null) {
      throw { msg: 'resource.xhr is null' };
    }

    tmx.parse(resource.xhr.responseText, resource.url, (err, map) => {
      if (err) throw err;

      map.tileSets.forEach((tileset) => {
        const tilesetRoot = path.join(route, path.dirname(tileset.source));

        if (!(tileset.image.source in this.resources)) {
          const targetURL = path.join(tilesetRoot, tileset.image.source);
          this.add(tileset.image.source, targetURL, loadOptions);
        }
      });

      resource.data = map;
      next();
    });
  };
}

export default tileMapLoader;
