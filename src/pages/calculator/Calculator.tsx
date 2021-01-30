import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Calculator.css";

const ICON_URL = process.env.PUBLIC_URL + "/assets/icon/logo-circle.png";

type DataValue = { [key in DataKey]: string | number };

enum DataKey {
  current = "current",
  weight = "weight",
  goal = "goal",
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
};

interface NumberModalProps {
  showModal: boolean;
  title: string;
  value: number;
  onDismiss: Function;
  onSuccess: Function;
}

const NumberModal: React.FC<NumberModalProps> = ({
  showModal,
  title,
  value: initialValue,
  onDismiss,
  onSuccess,
}) => {
  const [value, setValue] = useState(initialValue);
  const [showSuccess, setShowSuccess] = useState(true);

  const onChangeValue = (value: string): void => {
    if (!value.length) return;
    let newVal = parseInt(value, 10);
    if (isNaN(newVal)) return;

    setShowSuccess(newVal >= 0 && newVal <= 100);
    setValue(newVal);
  };

  return (
    <IonModal
      isOpen={showModal}
      mode="ios"
      cssClass="number-modal"
      swipeToClose={true}
      onDidDismiss={() => {
        setValue(initialValue);
        onDismiss();
      }}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              mode="md"
              color="danger"
              fill="clear"
              shape="round"
              onClick={() => {
                setValue(initialValue);
                onDismiss();
              }}
            >
              <IonIcon slot="icon-only" icon={closeCircle} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              mode="md"
              color="success"
              disabled={!showSuccess}
              onClick={() => onSuccess(value)}
            >
              <IonIcon slot="icon-only" icon={checkmarkCircle} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="input-wrapper">
          <IonInput
            clearInput={true}
            inputMode="decimal"
            type="number"
            value={value}
            onIonChange={({ detail }) =>
              detail.value && onChangeValue(detail.value)
            }
          />
        </div>
        <div className="info-text">
          Enter any value between 0 and 100 (inclusive).
        </div>
      </IonContent>
    </IonModal>
  );
};

interface ChatBubbleProps {
  data: DataValue;
  setData: any;
  index: DataKey;
  photoURL: string;
}

const ChatBubbleLine: React.FC<ChatBubbleProps> = React.memo(
  ({ data, setData, index, photoURL }) => {
    const [showModal, setShowModal] = useState(false);
    const successHandler = (value: number): void => {
      let dataCopy = data;
      dataCopy[index] = value;
      setData(dataCopy);
      setShowModal(false);
    };

    return (
      <>
        <NumberModal
          showModal={showModal}
          title={CHAT_DIALOGS.prompts[index]}
          value={data[index] as number}
          onDismiss={() => setShowModal(false)}
          onSuccess={successHandler}
        />
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
            <div
              className="ion-activatable bubble"
              onClick={() => setShowModal(true)}
            >
              {data[index]}%<IonRippleEffect></IonRippleEffect>
            </div>
          </div>
        </div>
      </>
    );
  }
);

interface DataProps {
  current: number;
  weight: number;
  goal: number;
}

const Calculation: React.FC<DataProps> = ({ goal, current, weight }) => {
  const grade = ((goal - current * (1 - weight / 100)) / weight) * 100;
  const colorClass =
    "grade-" + (grade >= 100 ? "danger" : grade <= 0 ? "success" : "warning");
  return <span className={colorClass}>{grade.toFixed(2)}%</span>;
};

const Calculator: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ ...INITIAL_DATA });
  const [showCalculation, setShowCalculation] = useState(false);

  const resetHandler = () => {
    setData({ ...INITIAL_DATA });
    setShowCalculation(false);
  };

  return (
    <PageWrapper>
      <div className="outer-wrapper">
        <div className="top-container">
          <PageTitle
            title="Grade Predictor"
            subtitle="Tap the green chat bubbles to configure."
          />
          <div className="messages">
            {Object.keys(DataKey).map((value, index) => (
              <ChatBubbleLine
                key={index}
                data={data}
                setData={setData}
                index={value as DataKey}
                photoURL={user.photoURL}
              />
            ))}
            <div
              className="line"
              style={{ opacity: showCalculation ? "1" : "0" }}
            >
              <div className="left">
                <IonAvatar slot="start">
                  <img src={ICON_URL} alt="" />
                </IonAvatar>
                <div className="bubble">
                  You will need to score at least&nbsp;
                  <Calculation {...data} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <IonButton
            onClick={() => setShowCalculation(true)}
            fill="outline"
            color="success"
            mode="md"
            shape="round"
          >
            Calculate
          </IonButton>
          <IonButton
            onClick={resetHandler}
            mode="md"
            fill="outline"
            color="danger"
            shape="round"
          >
            Reset
          </IonButton>
        </div>
      </div>
    </PageWrapper>
  );
};

export default React.memo(Calculator);
