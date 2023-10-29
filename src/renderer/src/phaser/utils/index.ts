export const isWithinGap = (objectA, ObjectB, tileGap) => {
  return Math.abs(objectA.x - ObjectB.x) < tileGap && Math.abs(objectA.y - ObjectB.y) < tileGap;
};
