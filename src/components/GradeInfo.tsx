import React from "react";
import styled from "styled-components";

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

export enum GRADE_INFO {
  SEMESTER_PAGE = "semester_page",
  SEMESTER_DROPDOWN = "semester_dropdown",
  COURSE_PAGE = "course_page",
  COURSE_DROPDOWN = "course_dropdown",
  CATEGORY_DROPDOWN = "category_dropdown",
}

interface GradeInfoProps {
  type: GRADE_INFO;
  data: { [key: string]: any };
}

export const GradeInfo: React.FC<GradeInfoProps> = React.memo(
  ({ type, data }) => {
    switch (type) {
      case GRADE_INFO.SEMESTER_PAGE:
      case GRADE_INFO.COURSE_DROPDOWN:
      case GRADE_INFO.SEMESTER_DROPDOWN:
        const keys = Object.keys(data);
        const values = Object.values(data);
        return (
          <Info>
            <Grid cols={keys.length}>
              {keys.map((key) => (
                <Label key={key}>{key}:</Label>
              ))}
              {values.map((key, index) => (
                <Item key={index}>{key}</Item>
              ))}
            </Grid>
          </Info>
        );
      default:
        return <></>;
    }
  }
);
