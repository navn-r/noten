import {
  IonHeader,
  IonPage,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import Menu from "../menu/Menu";
import "./Header.css";

interface Props {
  children?: React.ReactNode;
  id?: string;
  hasMenu?: boolean;
}

const InnerPageWrapper: React.FC<Props> = ({ children, id }) => {
  return (
    <IonPage id={id}>
      <IonHeader mode="md">
        <IonToolbar>
          <IonTitle id="header-title">Noten</IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
    </IonPage>
  );
};

const Header: React.FC<Props> = ({ children, hasMenu, id }) => {
  return !hasMenu ? (
    <InnerPageWrapper id={id}>{children}</InnerPageWrapper>
  ) : (
    <IonSplitPane contentId={id} when="xl">
      <Menu id={id}/>
      <InnerPageWrapper id={id}>{children}</InnerPageWrapper>
    </IonSplitPane>
  );
};

export default Header;
