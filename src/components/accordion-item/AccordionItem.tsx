import { IonIcon, IonRippleEffect } from "@ionic/react";
import { checkmarkCircle, chevronDownOutline, chevronUpOutline, closeCircle } from "ionicons/icons";
import React, { useState } from "react";
import useLongPress from "../UseLongPress";
import "./AccordionItem.css";

interface AccordionItemProps {
  title: string;
  isCurrent?: boolean;
  isPassFail?: boolean;
  children?: React.ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isCurrent, isPassFail, children, onPress, onLongPress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const longPress = useLongPress(onLongPress, onPress, 300);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <>
      <div className="accordion-card top-accordion">
        <div className="ion-activatable" {...longPress}>
          {title}
          <IonRippleEffect></IonRippleEffect>
        </div>
        <div onClick={toggleOpen} id="toggle-open">
          {isPassFail && (
            <div className="pass-fail">
              <IonIcon icon={checkmarkCircle} color="success"/>
              <IonIcon icon={closeCircle} color="danger"/>
            </div>
          )}
          {isCurrent && <IonIcon icon={checkmarkCircle} color="success"/>}
          <IonIcon
            icon={isOpen ? chevronUpOutline : chevronDownOutline}
            color="light"
          />
        </div>
      </div>
      {isOpen && children}
    </>
  );
};

export default React.memo(AccordionItem);
