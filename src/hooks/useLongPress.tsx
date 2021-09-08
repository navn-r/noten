import { MouseEvent, useCallback, useState } from 'react';

type PressHandler = (e?: MouseEvent<HTMLButtonElement>) => void;

const defaultHandler: PressHandler = (e) => e?.preventDefault();

/**
 * Custom Long Press Hook
 *
 * @see https://stackoverflow.com/questions/48048957/react-long-press-event/
 */
export const useLongPress = (
  onLongPress = defaultHandler,
  onPress = defaultHandler,
  ms = 500
): Record<string, PressHandler> => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const onContextMenu = defaultHandler;

  const timeOut = useCallback(() => {
    setTimer(null);
    onLongPress();
  }, [onLongPress]);

  const start = useCallback(() => {
    setTimer(setTimeout(timeOut.bind(null), ms));
  }, [timeOut, ms]);

  const stop = useCallback(
    (e) => {
      e.preventDefault();
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
        onPress();
      }
    },
    [onPress, timer]
  );

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onContextMenu,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};
