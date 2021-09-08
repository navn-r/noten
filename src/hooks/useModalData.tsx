import { useState } from 'react';

interface IModalData<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  reset: () => void;
}

/**
 * Modal Data state custom hook
 * @param defaultData default modal data
 */
export function useModalData<T>(defaultData: T): IModalData<T> {
  const [data, setData] = useState<T>(defaultData);

  /**
   * Resets the modal data
   */
  const reset = () => {
    setData(defaultData);
  };

  return { data, setData, reset };
}
