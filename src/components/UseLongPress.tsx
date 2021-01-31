import { useCallback, useState } from "react";

/**
 * Custom Long Press Hook
 * Adapted from: https://stackoverflow.com/questions/48048957/react-long-press-event/
 */
const useLongPress = (onLongPress = () => {}, onPress = () => {}, ms = 500) => {
  const [timer, setTimer] = useState(null as null | NodeJS.Timeout);

  const onContextMenu = (e: any) => e.preventDefault();

  const timeOut = useCallback(() => {
    setTimer(null);
    onLongPress();
  }, [onLongPress]);

  const start = useCallback(() => {
    setTimer(setTimeout(timeOut.bind(null), ms));
  }, [timeOut, ms]);

  const stop = useCallback((e) => {
    e.preventDefault();
    if (!!timer) {
      clearTimeout(timer);
      setTimer(null);
      onPress();
    }
  }, [onPress, timer]);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onContextMenu: onContextMenu,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};

export default useLongPress;
