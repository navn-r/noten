import { IonSpinner } from "@ionic/react";
import React from "react";
import './FullScreenSpinner.css';

const FullScreenSpinner: React.FC = () => {
  return (
    <div className="wrapper">
      <IonSpinner />
    </div>
  );
};

export default FullScreenSpinner;
