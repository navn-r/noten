import React from "react";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Calculator.css";

const Calculator: React.FC = () => {
  return (
    <PageWrapper>
        <h1>Calculator</h1>
        <blockquote><code>Pretty self explanatory.</code></blockquote>
    </PageWrapper>
  );
};

export default React.memo(Calculator);
