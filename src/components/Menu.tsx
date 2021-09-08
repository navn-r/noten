// eslint-disable-next-line import/no-extraneous-dependencies
import { menuController } from '@ionic/core';
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
} from '@ionic/react';
import { cafe, logoGithub } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useAuth } from '../hooks';

const MENU_ITEMS = [
  {
    name: 'Configure Semesters',
    href: '/settings/configure-semesters',
  },
  {
    name: 'Change Grade Scale',
    href: '/settings/change-grade-scale',
  },
] as const;

const Content = styled(IonContent)`
  --ion-background-color: var(--ion-tab-bar-background);
`;

const Item = styled(IonItem)`
  --ion-item-background: var(--ion-tab-bar-background);
  --inner-border-width: 0;
`;

const Toolbar = styled(IonToolbar)`
  height: 3rem;
`;

const Button = styled(IonButton)`
  height: 3.5rem;
  font-size: 1rem;
  margin: 0.5rem 0 0;
`;

const ButtonContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ButtonIcon = styled(IonIcon)`
  margin-right: 0.5rem;
  padding: 0;
  width: 1.375rem;
  height: 1.375rem;
`;

const Divider = styled(IonItemDivider)`
  min-height: 1px;
`;

const Footer = styled(IonFooter)`
  position: fixed;
  width: 100%;
  bottom: 0;
`;

const Label = styled(IonLabel)`
  height: 4rem;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
`;

const Title = styled(IonTitle)`
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  margin-top: -0.25rem;
`;

interface IMenuProps {
  id: string;
}

const Menu: React.FC<IMenuProps> = ({ id }) => {
  const { user, authenticated, logout } = useAuth();
  const history = useHistory();

  const onNavigate = (href: string): void => {
    menuController.close();
    history.replace(href);
  };

  if (!authenticated) {
    return <></>;
  }

  return (
    <IonMenu side="start" contentId={id} swipeGesture type="reveal">
      <IonHeader mode="md">
        <Toolbar color="secondary">
          <Title>Settings</Title>
        </Toolbar>
      </IonHeader>
      <Content>
        {!!user && (
          <Item>
            <IonAvatar slot="start">
              <IonImg
                src={
                  user.photoURL ??
                  `${process.env.PUBLIC_URL}/assets/icon/logo-circle.png`
                }
                alt=""
              />
            </IonAvatar>
            <Label>
              <h3>{user.displayName}</h3>
              <p>{user.email}</p>
            </Label>
          </Item>
        )}
        <Divider color="dark" />
        {MENU_ITEMS.map(({ href, name }) => (
          <Button
            key={href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(href);
            }}
            fill="clear"
            color="light"
            mode="ios"
            expand="block"
          >
            <ButtonContent>{name}</ButtonContent>
          </Button>
        ))}
        <Divider color="dark" />
        <Button
          href="https://github.com/navn-r/noten"
          fill="clear"
          color="light"
          mode="ios"
          expand="block"
        >
          <ButtonContent>
            <ButtonIcon icon={logoGithub} />
            <span>GitHub</span>
          </ButtonContent>
        </Button>
        <Button
          href="https://buymeacoffee.com/navinn"
          fill="clear"
          color="light"
          mode="ios"
          expand="block"
        >
          <ButtonContent>
            <ButtonIcon icon={cafe} />
            <span> Donate</span>
          </ButtonContent>
        </Button>
        <Footer>
          <Button
            mode="md"
            expand="full"
            onClick={async (e) => {
              e.preventDefault();
              await logout();
              onNavigate('/login');
            }}
            color="danger"
          >
            log out
          </Button>
        </Footer>
      </Content>
    </IonMenu>
  );
};

export default Menu;
