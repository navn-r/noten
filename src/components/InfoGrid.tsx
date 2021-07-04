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

const Item = styled.span`
  display: flex;
  justify-content: center;
`;

const Label = styled(Item)`
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

interface IInfoGridProps {
  data: Record<string, React.ReactChild>;
}

export const InfoGrid: React.FC<IInfoGridProps> = React.memo(
  ({ data, children }) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    return (
      <Info>
        <Grid cols={keys.length + React.Children.count(children)}>
          {keys.map((key) => (
            <Label key={key}>{key}:</Label>
          ))}
          {values.map((value, index) => (
            <Item key={`${keys[index]}-${value}`}>{value}</Item>
          ))}
          {children}
        </Grid>
      </Info>
    );
  }
);
