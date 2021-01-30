import React from "react";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Semesters.css";

const Semesters: React.FC = () => {
  return (
    <PageWrapper>
        <PageTitle title="Semesters" subtitle="Tap to select a semester. Long press to modify." showBack={true}/>
    </PageWrapper>
  );
};

export default React.memo(Semesters);
