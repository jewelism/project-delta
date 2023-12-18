export const GAME = {
  scale: 2.5,
};

export const getUIStyle = () => {
  return {
    fontSize: '15px',
    color: '#ffffff',
    align: 'left',
  };
};
export const UPGRADE_TEXT_STYLE = {
  fontSize: 14,
  fontStyle: 'bold',
  color: '#000000',
  stroke: '#ffffff',
  strokeThickness: 2, // 테두리 두께
};

export const INIT_PLAYER_STATE_LIST = [
  {
    id: 'attackDamage',
    spriteKey: 'sword1',
    shortcutText: 'A',
    desc: 'attack damage +1',
  },
  {
    id: 'attackSpeed',
    spriteKey: 'fist',
    shortcutText: 'S',
    desc: 'attack speed +1%',
  },
  { id: 'moveSpeed', spriteKey: 'boots', shortcutText: 'D', desc: 'move speed +1%' },
  { id: 'defence', spriteKey: 'defence1', shortcutText: 'F', desc: 'defence +1' },
  { id: 'hp', spriteKey: 'boots', shortcutText: 'G', desc: 'hp +1%' },
];
