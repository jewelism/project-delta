import { Resource } from '@/phaser/objects/Resource';
import { resourceGapCheck } from '@/phaser/utils';

const getRandomResource = (scene: Phaser.Scene, { x, y }) => {
  return Phaser.Math.RND.pick([
    () => new Resource(scene, { x, y, name: 'rock' }).setScale(0.6),
    () => new Resource(scene, { x, y, name: 'tree' }).setScale(0.5),
  ])();
};

export const generateResource = ({
  scene,
  resourceSpawnPoints,
  bgLayer,
  resources,
}: {
  scene: Phaser.Scene;
  resourceSpawnPoints: Phaser.Types.Tilemaps.TiledObject[];
  bgLayer: Phaser.Tilemaps.TilemapLayer;
  resources: Phaser.Physics.Arcade.Group;
}) => {
  resourceSpawnPoints.forEach(({ x, y, width, height }) => {
    const tiles = bgLayer.getTilesWithinWorldXY(x, y, width, height);
    tiles.forEach((tile) => {
      const tileGap = Phaser.Math.RND.pick(
        Array.from({ length: 20 }, (_, i) => tile.width * (i + 5)),
      );
      if (!resourceGapCheck(tile, resources.getChildren(), tileGap)) {
        return;
      }
      const resource = getRandomResource(scene, { x: tile.pixelX, y: tile.pixelY });
      scene.physics.add.existing(resource, true);
      resources.add(resource);
    });
  });
};
