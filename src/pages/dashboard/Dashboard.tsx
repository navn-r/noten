import React from "react";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <PageWrapper>
        <h1>Dashboard</h1>
        <blockquote><code>Grades go here.</code></blockquote>
    </PageWrapper>
  );
};

export default React.memo(Dashboard);
