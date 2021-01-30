import React from "react";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <PageWrapper>
        <PageTitle title="Dashboard" subtitle="Tap a course to open. Long press to modify."/>
    </PageWrapper>
  );
};

export default React.memo(Dashboard);
