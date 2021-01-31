import React from "react";
import "./GradeInfo.css";

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
          <div className={`accordion-card grade-info`}>
            <div
              style={{ gridTemplateColumns: `repeat(${keys.length}, 1fr)` }}
              className={`grade-info-row col-info-row-${keys.length}`}
            >
              {keys.map((key) => (
                <span key={key}>{key}:</span>
              ))}
              {values.map((key, index) => (
                <span key={index}>{key}</span>
              ))}
            </div>
          </div>
        );
      default:
        return <></>;
    }
  }
);
