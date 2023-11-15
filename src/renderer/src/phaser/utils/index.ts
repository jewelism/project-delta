const isWithinGap = (tile, object, tileGap) => {
  return Math.abs(tile.pixelX - object.x) < tileGap && Math.abs(tile.pixelY - object.y) < tileGap;
};

export const resourceGapCheck = (tile, resources, tileGap) => {
  return resources.every((resource) => {
    if (isWithinGap(tile, resource, tileGap)) {
      return false;
    }
    return true;
  });
};
