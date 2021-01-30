import React from "react";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./GradeScale.css";

const GradeScale: React.FC = () => {
  return (
    <PageWrapper>
      <PageTitle
        title="Grade Scales"
        subtitle="Tap the name of the scale to select it."
        showBack={true}
      />
    </PageWrapper>
  );
};

export default React.memo(GradeScale);
