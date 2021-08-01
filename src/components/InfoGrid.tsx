import React from 'react';
import styled from 'styled-components';

const Info = styled.div`
  background-color: var(--ion-color-step-100);
  border-radius: 20px;
  display: grid;
  padding: 1rem;
`;

const Grid = styled.div<{ cols: number }>`
  display: grid;
  padding: 0 1rem;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
`;

const Column = styled.div`
  display: grid;
  row-gap: 0.25rem;
`;

const Item = styled.span`
  display: flex;
  justify-content: center;
`;

const Label = styled(Item)`
  font-size: 0.75rem;
`;

interface IInfoGridProps {
  data: Record<string, React.ReactChild>;
  children?: React.ReactNode;
}

export const InfoGrid = ({
  data,
  children,
}: IInfoGridProps): React.ReactElement<IInfoGridProps> => {
  const entries = Object.entries(data);
  return (
    <Info>
      <Grid cols={entries.length + React.Children.count(children)}>
        {entries.map(([key, value]) => (
          <Column key={key}>
            <Label>{key}:</Label>
            <Item>{value}</Item>
          </Column>
        ))}
        {children}
      </Grid>
    </Info>
  );
};

InfoGrid.Column = Column;
InfoGrid.Label = Label;
InfoGrid.Item = Item;
