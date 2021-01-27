import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,

  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,

  IonMenu,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import "./Menu.css";

interface Props {
  id: string | undefined;
}

const Menu: React.FC<Props> = ({ id }) => {
  const { user } = useAuth();
  const { logout } = useAuth();
  const history = useHistory();
  const onLogout = useCallback(
    (e: any) => {
      e.preventDefault();
      logout(() => history.goBack());
    },
    [history, logout]
  );

  return (
    <IonMenu side="start" contentId={id} swipeGesture={true} type="reveal">
      <IonHeader mode="md">
        <IonToolbar color="secondary" className="menu-toolbar">
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="menu-content">
        <IonItem id="user-info">
          <IonAvatar slot="start">
            <IonImg src={user.photoURL} alt="" />
          </IonAvatar>
          <IonLabel>
            <h3>{user.displayName}</h3>
            <p>{user.email}</p>
          </IonLabel>
        </IonItem>
        <IonItemDivider color="dark"/>
        <IonButton fill="clear" color="light" mode="md" expand="block">
          Configure Semesters
        </IonButton>
        <IonButton fill="clear" color="light" mode="md" expand="block">
          Set Default Grade Scale
        </IonButton>
        <IonFooter id="bottom">
          <IonButton expand="full" onClick={onLogout} color="danger">
            logout
          </IonButton>
        </IonFooter>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
