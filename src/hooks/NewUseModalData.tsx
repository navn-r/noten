import React, { useState } from 'react';

interface ModalData<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  showModal: boolean;
  openModal: (update?: Partial<T>) => void;
  closeModal: (resetData: boolean) => void;
}

/**
 * Modal Data state custom hook
 * @param defaultData default modal data
 */
export function useModalData<T>(defaultData: T): ModalData<T> {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<T>(defaultData);

  /**
   * Opens the modal.
   *
   * @param update update modal data before opening
   */
  const openModal = (update?: Partial<T>) => {
    setShowModal(true);
    setData((data) => ({ ...data, ...update }));
  };

  /**
   * Closes the modal.
   *
   * @param shouldResetData if data should be cleared when closing
   */
  const closeModal = (shouldResetData = true) => {
    if (shouldResetData) {
      setData(defaultData);
    }
    setShowModal(false);
  };

  return { data, setData, showModal, openModal, closeModal };
}
