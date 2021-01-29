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
  IonToolbar,
} from "@ionic/react";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import "./Menu.css";

interface Props {
  id: string | undefined;
}

const Menu: React.FC<Props> = ({ id }) => {
  const { user, authenticated, logout } = useAuth();
  const history = useHistory();
  const onLogout = useCallback(
    (e: any) => {
      e.preventDefault();
      logout(() => history.replace("/login"));
    },
    [history, logout]
  );

  return (
    authenticated && (
      <IonMenu side="start" contentId={id} swipeGesture={true} type="reveal">
        <IonHeader mode="md">
          <IonToolbar color="secondary" className="menu-toolbar">
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="menu-content">
          {!!user && (
            <IonItem id="user-info">
              <IonAvatar slot="start">
                <IonImg src={user.photoURL} alt="" />
              </IonAvatar>
              <IonLabel>
                <h3>{user.displayName}</h3>
                <p>{user.email}</p>
              </IonLabel>
            </IonItem>
          )}
          <IonItemDivider color="dark" />
          <IonButton fill="clear" color="light" mode="ios" expand="block">
            <div className="menu-button">
              <span>Configure Semesters</span>
            </div>
          </IonButton>
          <IonButton className="menu-button" fill="clear" color="light" mode="ios" expand="block">
          <div className="menu-button">
              <span>Set Default Scale</span>
            </div>
          </IonButton>
          <IonFooter id="bottom">
            <IonButton
              mode="md"
              expand="full"
              onClick={onLogout}
              color="danger"
            >
              logout
            </IonButton>
          </IonFooter>
        </IonContent>
      </IonMenu>
    )
  );
};

export default React.memo(Menu);
