import { IonAvatar, IonButton } from "@ionic/react";
import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Calculator.css";

const ICON_URL = process.env.PUBLIC_URL + "/assets/icon/logo-circle.png";

type DataValue = { [key in DataKey]: string | number };

enum DataKey {
  CURRENT = "current",
  WEIGHT = "weight",
  GOAL = "goal",
}

const CHAT_DIALOGS = {
  messages: {
    current: "What is your average right now?",
    weight: "How much is the mark weighed at?",
    goal: "What average do you want?",
  },
  prompts: {
    current: "Enter Current Average",
    weight: "Enter Mark Weight",
    goal: "Enter Desired Average",
  },
};

const INITIAL_DATA = {
  current: 69,
  weight: 8.832,
  goal: 100,
  showCalculation: false,
};

interface ChatBubbleProps {
  data: DataValue;
  index: DataKey;
  photoURL: string;
}

const ChatBubbleLine: React.FC<ChatBubbleProps> = ({
  data,
  index,
  photoURL,
}) => {
  return (
    <div className="line">
      <div className="left">
        <IonAvatar slot="start">
          <img src={ICON_URL} alt="" />
        </IonAvatar>
        <div className="bubble">{CHAT_DIALOGS.messages[index]}</div>
      </div>
      <div className="right">
        <IonAvatar slot="end">
          <img src={photoURL} alt="" />
        </IonAvatar>
        <div className="bubble">{data[index]}%</div>
      </div>
    </div>
  );
};

const Calculation: React.FC<any> = ({ data }) => {
  // TODO: change any to props
  const { goal, current, weight } = data;
  const grade = ((goal - current * (1 - weight / 100)) / weight) * 100;
  const colorClass =
    "grade-" + (grade >= 100 ? "danger" : grade <= 0 ? "success" : "warning");
  return <span className={colorClass}>{grade.toFixed(2)}%</span>;
};

const Calculator: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState(INITIAL_DATA);

  return (
    <PageWrapper>
      <h5 id="title">Grade Predictor</h5>
      <div className="messages">
        {["current", "weight", "goal"].map((value, index) => (
          <ChatBubbleLine
            key={index}
            data={data}
            index={value as DataKey}
            photoURL={user.photoURL}
          />
        ))}
        {data.showCalculation && (
          <div className="line">
            <div className="left">
              <IonAvatar slot="start">
                <img src={ICON_URL} alt="" />
              </IonAvatar>
              <div className="bubble">
                You will need to score at least&nbsp;
                <Calculation data={data} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="button-container">
        <IonButton
          onClick={() => setData({ ...data, showCalculation: true })}
          fill="outline"
          color="success"
          mode="md"
          shape="round"
        >
          Calculate
        </IonButton>
        <IonButton
          onClick={() => setData({ ...INITIAL_DATA })}
          mode="md"
          fill="outline"
          color="danger"
          shape="round"
        >
          Reset
        </IonButton>
      </div>
      <div className="info-text">Tap the green chat bubbles to configure.</div>
    </PageWrapper>
  );
};

export default React.memo(Calculator);
