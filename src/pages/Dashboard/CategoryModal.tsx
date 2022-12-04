import { IonButton, IonIcon, useIonAlert } from '@ionic/react';
import { trash } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ModalProps, Modal } from '../../components';
import { useService } from '../../hooks';
import { UID, Category } from '../../types';

const CategoryRowContainer = styled.div`
  display: grid;
  width: 95%;
  grid-template-columns: 1fr 8fr 4fr;
  align-items: center;
  margin: -1.5rem auto;
`;

const DeleteCategoryButton = styled(IonButton)`
  --padding-start: 0;
  --padding-end: 0;
  margin: 3rem 0 0;
  padding: 0;
`;

interface CategoryRowProps {
  category: CategoryModalData['categories'][0];
  setEntry: (key: string, entry: string | number) => void;
  onRemove: () => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  setEntry,
  onRemove,
}) => (
  <CategoryRowContainer>
    <DeleteCategoryButton
      fill="clear"
      size="small"
      expand="block"
      mode="ios"
      onClick={onRemove}
    >
      <IonIcon icon={trash} slot="icon-only" color="danger" mode="ios" />
    </DeleteCategoryButton>
    <Modal.Input
      label="Name"
      placeholder="eg. Assignments"
      value={category.name}
      onChange={(name: string) => setEntry('name', name)}
    />
    <Modal.Input
      type="number"
      label="Percent Weight"
      placeholder="eg. 20"
      value={category.weight}
      onChange={(weight: number) => setEntry('weight', weight)}
    />
  </CategoryRowContainer>
);

/** Category Modal */

const Separator = styled(Modal.Input.Separator)`
  margin-bottom: 0.5rem;
`;

export type CategoryModalData = {
  id: UID;
  categories: (Omit<Category, 'courseKey'> & {
    id: UID;
  })[];
};

interface CategoryModalProps extends ModalProps {
  data: CategoryModalData;
  setData: React.Dispatch<React.SetStateAction<CategoryModalData>>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  data,
  setData,
}) => {
  const service = useService();
  const [showSuccess, setShowSuccess] = useState(false);
  const [present] = useIonAlert();

  /**
   * Creates a new category row item.
   * Calling service only for id generation.
   */
  const addCategory = () => {
    setData({
      ...data,
      categories: [
        {
          id: service.key('catagories'),
          name: '',
          weight: 0,
          numGrades: 0,
        },
        ...data.categories,
      ],
    });
  };

  /**
   * Curried function to set an entry in the category row.
   * @param id category id
   */
  const setEntry =
    (id: UID) =>
    /**
     * @param key   property of category ('name' OR 'weight')
     * @param entry value of the property to be updated
     */
    (key: string, entry: string | number) => {
      setData({
        ...data,
        categories: data.categories.map((c) =>
          c.id === id ? { ...c, [key]: entry } : c
        ),
      });
    };

  /**
   * Alerts before deletion of category.
   * @param id category id
   * @param name category name
   */
  const removeEntry = (id: UID, name?: string) => {
    // Easier to use Ionic Hook versus IonAlert component
    present({
      header: `Delete ${name || 'Category'}?`,
      message:
        'Are you sure? <strong>THIS ACTION IS IRREVERSIBLE!</strong> <br /><br /> All Grades for this category will be deleted.',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alert-cancel',
          role: 'cancel',
        },
        {
          text: 'Proceed',
          cssClass: 'alert-proceed',
          handler: () =>
            setData({
              ...data,
              categories: data.categories.filter((c) => c.id !== id),
            }),
        },
      ],
    });
  };

  useEffect(() => {
    // Sum of all (positive) weights must equal 100%
    setShowSuccess(
      data.categories.every(({ weight }) => +weight > 0) &&
        data.categories.reduce((p, { weight }) => p + +weight, 0) === 100
    );
  }, [data.categories]);

  return (
    <Modal
      showModal={showModal}
      showSuccess={showSuccess}
      title={`${data.id ? 'Edit' : 'Add'} Categories`}
      onSuccess={onSuccess}
      onDismiss={onDismiss}
    >
      <Modal.Input.OuterWrapper>
        <Modal.Input.Label>
          Total weight of all categories must equal 100%, and all weights must
          be positive.
        </Modal.Input.Label>
        <Modal.Input.Button mode="ios" color="tertiary" onClick={addCategory}>
          Add New Category
        </Modal.Input.Button>
      </Modal.Input.OuterWrapper>
      <Separator />
      {data.categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          setEntry={setEntry(category.id)}
          onRemove={() => removeEntry(category.id, category.name.trim())}
        />
      ))}
    </Modal>
  );
};
