export const animationState = $state({
  isOpen: false,
  preset: 'off' as 'off' | 'streams' | 'rainbow',
  intensity: 0.6,
  speed: 1.0,
  textInteraction: true,
  pointerInteraction: true,
  palette: 'auto' as 'auto' | 'warm' | 'cool' | 'eink'
});
