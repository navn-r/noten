import React, { useState } from "react";
import AccordionItem from "../../components/accordion-item/AccordionItem";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Semesters.css";

const MOCK_SEMESTERS = [
  {
    id: "-M6vO_oW4hzj9B2_d-ie",
    name: "Fall 2020",
    average: 85,
    grade: 'A+',
    gpa: 4.0,
    numCourses: 1
  },
  {
    id: "-M70HLw6GQAkUS913_zX",
    name: "Summer 2020",
    average: 75,
    grade: 'B',
    gpa: 3.0,
    numCourses: 4
  },
  {
    id: "-M71HLw6GQAkUS924_zV",
    name: "Winter 2020",
    average: 65,
    grade: 'C-',
    gpa: 2.0,
    numCourses: 3
  }
]

const LOGO_URL = process.env.PUBLIC_URL + "/assets/icon/logo-circle.png";

const Semesters: React.FC = () => {
  const [current, setCurrent] = useState("-M6vO_oW4hzj9B2_d-ie");

  /**
   * TODO: Setup after db
   */
  const setSemester = (id: string) => setCurrent(id);
  const editSemester = (id: string) => console.log(`EDITING: ${id}`);
  const numSemesters = 3;

  return (
    <PageWrapper>
        <PageTitle title="Semesters" subtitle={numSemesters ? "Tap to select a semester. Long press to modify." : "You currently have no semesters."} showBack={true}/>
        {!!numSemesters ? MOCK_SEMESTERS.map(({id, name: title, average, grade, gpa, numCourses}, index) => (
          <AccordionItem key={id} title={title} onPress={setSemester.bind(null, id)} onLongPress={editSemester.bind(null, id)} isCurrent={current === id}>
              <div className="accordion-card semester-info">
                <div className="semester-info-row">
                  <span>Grade:</span> <span>Average:</span> <span>GPA:</span> <span>Courses:</span>
                  <span>{grade}</span> <span>{average.toFixed(2)}%</span> <span>{gpa.toFixed(2)}</span> <span>{numCourses}</span>
                </div>
              </div>
          </AccordionItem>
        )) : (
          <div className="empty-page">
            <img src={LOGO_URL} alt=""/>
          </div>
        )}
    </PageWrapper>
  );
};

export default React.memo(Semesters);
