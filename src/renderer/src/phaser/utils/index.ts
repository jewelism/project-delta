export const isWithinGap = (tile, object, tileGap) => {
  return Math.abs(tile.pixelX - object.x) < tileGap && Math.abs(tile.pixelY - object.y) < tileGap;
};
