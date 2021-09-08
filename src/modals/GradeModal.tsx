import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IModalProps, Modal } from '../components';

const SplitWrapper = styled.div<{ cols: number }>`
  display: grid;
  width: ${({ cols }) => (cols < 2 ? '100' : '95')}%;
  margin: -1.5rem auto;
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
`;

export type GradeModalData = { id?: Noten.UID } & Noten.IGrade;

interface IGradeModalProps extends IModalProps {
  data: GradeModalData;
  setData: React.Dispatch<React.SetStateAction<GradeModalData>>;
  deleteGrade: (key: Noten.UID) => Promise<void>;
}

export const GradeModal: React.FC<IGradeModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  data,
  setData,
  deleteGrade,
}) => {
  const [showPercentage, setShowPercentage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Grade must be valid to submit
  useEffect(() => {
    const score = +data.score;
    const total = +data.total;
    const percent = score / total;
    setShowSuccess(
      data.name.trim().length > 0 &&
        score >= 0 &&
        total > 0 &&
        !Number.isNaN(percent) &&
        Number.isFinite(percent)
    );
  }, [data]);

  return (
    <Modal
      showModal={showModal}
      showSuccess={showSuccess}
      title={`${data.id ? 'Edit' : 'New'} Grade`}
      onSuccess={onSuccess}
      onDismiss={onDismiss}
    >
      <Modal.Input
        label="Grade Name"
        placeholder="e.g. Super hard assignment"
        value={data.name}
        onChange={(name) => setData({ ...data, name })}
      />
      <Modal.Input.OuterWrapper>
        <Modal.Input.Label>Point System</Modal.Input.Label>
        <Modal.Input.Button
          onClick={() => setShowPercentage((showPercentage) => !showPercentage)}
          mode="ios"
          color="tertiary"
        >
          {showPercentage ? 'Percent' : 'Score'} Based
        </Modal.Input.Button>
      </Modal.Input.OuterWrapper>
      <SplitWrapper cols={showPercentage ? 1 : 2}>
        <Modal.Input
          type="number"
          label={showPercentage ? 'Percentage' : 'Score'}
          placeholder={showPercentage ? 'eg. 69' : 'eg. 13.8'}
          value={data.score}
          onChange={(score) =>
            setData({
              ...data,
              score,
              total: showPercentage ? 100 : data.total,
            })
          }
        />
        {!showPercentage && (
          <Modal.Input
            type="number"
            label="Total"
            placeholder="eg. 20"
            value={data.total}
            onChange={(total: number) => setData({ ...data, total })}
          />
        )}
      </SplitWrapper>
      <Modal.Input.OuterWrapper>
        <Modal.Input.Label>Incognito Grade</Modal.Input.Label>
        <Modal.Input.Button
          expand="block"
          onClick={() => setData({ ...data, isIncluded: !data.isIncluded })}
          mode="ios"
          color={data.isIncluded ? 'success' : 'danger'}
        >
          Grade is{data.isIncluded ? '' : ' not'} included in calculations
        </Modal.Input.Button>
      </Modal.Input.OuterWrapper>
      {!!data.id && (
        <>
          <Modal.Input.Separator />
          <Modal.Input.Button
            expand="block"
            color="danger"
            mode="ios"
            onClick={async () => {
              await deleteGrade(data.id || '');
              onDismiss();
            }}
          >
            Delete Grade
          </Modal.Input.Button>
        </>
      )}
    </Modal>
  );
};
