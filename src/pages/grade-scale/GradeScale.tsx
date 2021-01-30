import React, { useState } from "react";
import AccordionItem from "../../components/accordion-item/AccordionItem";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./GradeScale.css";

export const DEFAULT_GRADE_SCALE = 2;

export const GRADE_SCALES = {
  letter: ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"],
  percent: [90,85,80,77,73,70,67,63,60,57,53,50,0],
  scales: [
    {
      title: "5 Point",
      scale: [5.0,5.0,4.7,4.3,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,0.0]
    },
    {
      title: "4.3 Point",
      scale: [4.33,4.0,3.67,3.33,3.0,2.67,2.33,2.0,1.67,1.33,1.0,0.67,0.0]
    },
    {
      title: "4 Point",
      scale: [4.0,3.9,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.7,0.0]
    },
    {
      title: "4 Point Alt.",
      scale: [4.0,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.7,0.0]
    }
  ]
}

export const GradeScale: React.FC = React.memo(() => {
  const [current, setCurrent] = useState(DEFAULT_GRADE_SCALE);

  // TODO: after setup db
  const setGradeScale = (index: number): void => {
    setCurrent(index);
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Grade Scales"
        subtitle="Tap the name of the scale to select it."
        showBack={true}
      />
      {GRADE_SCALES.scales.map(({title, scale}, index) => (
        <AccordionItem key={index} onPress={setGradeScale.bind(null, index)} title={title} isCurrent={current === index}>
          <div className="accordion-card scale-body">
            {scale.map((num, index) => (
              <div key={index} className="scale-row">
                <span>{GRADE_SCALES.letter[index]}</span>
                <span>{num.toFixed(2)}</span>
                <span>{GRADE_SCALES.percent[index]}%</span>
              </div>
            ))}
          </div>
        </AccordionItem>
      ))}
    </PageWrapper>
  );
});