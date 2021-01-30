import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonMenu,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { cafe, logoGithub } from "ionicons/icons";
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
          <IonButton routerLink="/settings/configure-semesters"  fill="clear" color="light" mode="ios" expand="block">
            <div className="menu-button">
              <span>Configure Semesters</span>
            </div>
          </IonButton>
          <IonButton
            className="menu-button"
            routerLink="/settings/set-default-scale"
            fill="clear"
            color="light"
            mode="ios"
            expand="block"
          >
            <div className="menu-button">
              <span>Set Default Scale</span>
            </div>
          </IonButton>
          <IonItemDivider color="dark" />
          <IonButton
            className="menu-button"
            href="https://github.com/navn-r/noten"
            fill="clear"
            color="light"
            mode="ios"
            expand="block"
          >
            <div className="menu-button">
              <IonIcon icon={logoGithub} />
              <span> Code (<code style={{fontSize: '0.875rem'}}>GitHub</code>)</span>
            </div>
          </IonButton>
          <IonButton
            className="menu-button"
            href="https://buymeacoffee.com/navinn"
            fill="clear"
            color="light"
            mode="ios"
            expand="block"
          >
            <div className="menu-button">
              <IonIcon icon={cafe} />
              <span> Donate</span>
            </div>
          </IonButton>
          <IonFooter id="bottom">
            <IonButton
              mode="md"
              expand="full"
              onClick={onLogout}
              color="danger"
            >
              log out
            </IonButton>
          </IonFooter>
        </IonContent>
      </IonMenu>
    )
  );
};

export default React.memo(Menu);
