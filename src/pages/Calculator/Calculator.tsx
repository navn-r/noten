import { IonAvatar, IonButton, IonRippleEffect } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IModalProps, Modal, Page } from '../../components';
import { useAuth } from '../../hooks';

enum Key {
  current = 'current',
  weight = 'weight',
  goal = 'goal',
}

type ICalculatorData<T> = { [key in Key]: T };

const DefaultData: ICalculatorData<number> = {
  current: 69,
  weight: 8.832,
  goal: 100,
} as const;

const Messages: ICalculatorData<string> = {
  current: 'What is your average right now?',
  weight: 'How much is the mark weighed at?',
  goal: 'What average do you want?',
} as const;

const Prompts: ICalculatorData<string> = {
  current: 'Enter Current Average',
  weight: 'Enter Mark Weight',
  goal: 'Enter Desired Average',
};

const InfoText = styled.div`
  color: var(--ion-color-medium);
  font-size: 1rem;
  width: 100%;
  text-align: center;
`;

interface NumberIModalProps extends IModalProps {
  currentKey: Key | null;
  data: ICalculatorData<number>;
}

const NumberModal: React.FC<NumberIModalProps> = ({
  currentKey,
  data,
  onDismiss,
  onSuccess,
}) => {
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    setShowSuccess(!!value && value >= 0 && value <= 100);
  }, [value]);

  useEffect(() => {
    if (currentKey) {
      setValue(data[currentKey]);
      setTitle(Prompts[currentKey]);
    }
  }, [currentKey, data]);

  return (
    <Modal
      partial
      showModal={!!currentKey}
      title={title}
      showSuccess={showSuccess}
      onSuccess={() => onSuccess(currentKey, value)}
      onDismiss={onDismiss}
    >
      <Modal.Input
        type="number"
        value={value}
        onChange={setValue}
        placeholder={`eg. ${DefaultData[currentKey ?? 'current']}`}
      />
      <InfoText>Enter any value between 0 and 100 (inclusive).</InfoText>
    </Modal>
  );
};

/** ChatLine */

const Avatar = styled(IonAvatar)`
  width: 2rem;
  height: 2rem;
  transform: translateY(0.75rem);
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  margin: 1.375rem 0;
`;

const Bubble = styled.div`
  padding: 0.625rem;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Left = styled(Line)`
  ${Bubble} {
    background-color: var(--ion-color-dark-shade);
    border-bottom-left-radius: 0;
    margin-left: 0.5rem;
  }
`;

const Right = styled(Line)`
  flex-direction: row-reverse;

  ${Bubble} {
    background-color: var(--ion-color-success-shade);
    border-bottom-right-radius: 0;
    margin-right: 0.5rem;
    min-width: 3.25rem;
    position: relative;
    overflow: hidden;
  }
`;

interface IChatLineProps {
  message: React.ReactChild;
  value?: number;
  onShowModal?: () => void;
}

const ICON_URL = `${process.env.PUBLIC_URL}/assets/icon/logo-circle.png`;

const ChatLine: React.FC<IChatLineProps> = ({
  message,
  value,
  onShowModal,
}) => {
  const { user } = useAuth();

  return (
    <div>
      <Left>
        <Avatar slot="start">
          <img src={ICON_URL} alt="" />
        </Avatar>
        <Bubble>{message}</Bubble>
      </Left>
      {value && (
        <Right>
          <Avatar slot="end">
            <img src={user?.photoURL ?? ICON_URL} alt="" />
          </Avatar>
          <Bubble className="ion-activatable" onClick={onShowModal}>
            {value}%
            <IonRippleEffect />
          </Bubble>
        </Right>
      )}
    </div>
  );
};

/** Calculator */

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ChatLineContainer = styled.div`
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 4rem;
`;

const Button = styled(IonButton)`
  height: 70%;
  width: 95%;
  margin: auto;
`;

const Calculation = styled.span`
  color: ${({ color }) => `var(--ion-color-${color})`};
`;

interface ICalculatorState {
  data: ICalculatorData<number>;
  currentKey: Key | null;
  showCalculation: boolean;
}
class Calculator extends React.Component<unknown, ICalculatorState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      data: { ...DefaultData },
      showCalculation: false,
      currentKey: null,
    };

    this._reset = this._reset.bind(this);
    this._onModalSuccess = this._onModalSuccess.bind(this);
  }

  private get data(): ICalculatorData<number> {
    return this.state.data;
  }

  private set data(data: ICalculatorData<number>) {
    this.setState({ data });
  }

  private get showCalculation(): boolean {
    return this.state.showCalculation;
  }

  private set showCalculation(showCalculation: boolean) {
    this.setState({ showCalculation });
  }

  private get currentKey(): Key | null {
    return this.state.currentKey;
  }

  private set currentKey(currentKey: Key | null) {
    this.setState({ currentKey });
  }

  private _reset(): void {
    this.setState({
      data: { ...DefaultData },
      showCalculation: false,
      currentKey: null,
    });
  }

  private _onModalSuccess(key: Key | null, value: number): void {
    if (key) {
      this.data = {
        ...this.data,
        [key]: +value,
      };
    }
    this.currentKey = null;
  }

  private _renderChatLines(): React.ReactElement[] {
    return Object.entries(Messages).map(([key, value]) => (
      <ChatLine
        key={key}
        message={value}
        value={this.data[key as Key]}
        onShowModal={() => {
          this.currentKey = key as Key;
        }}
      />
    ));
  }

  private _renderCalculation(): React.ReactElement {
    const { goal, current, weight } = this.data;
    const grade = ((goal - current * (1 - weight / 100)) / weight) * 100;
    const color = grade >= 100 ? 'danger' : grade <= 0 ? 'success' : 'warning';

    return (
      <ChatLine
        message={
          <>
            You will need to score at least&nbsp;
            <Calculation color={color}>{grade.toFixed(2)}%</Calculation>
          </>
        }
      />
    );
  }

  render(): React.ReactElement {
    return (
      <Page>
        <Outer>
          <div>
            <Page.Title
              title="Grade Predictor"
              subtitle="Tap the green chat bubbles to configure."
            />
            <NumberModal
              currentKey={this.currentKey}
              data={this.data}
              onDismiss={() => {
                this.currentKey = null;
              }}
              onSuccess={this._onModalSuccess}
            />
            <ChatLineContainer>
              {this._renderChatLines()}
              {this.showCalculation && this._renderCalculation()}
            </ChatLineContainer>
          </div>
          <ButtonContainer>
            <Button
              onClick={() => {
                this.showCalculation = true;
              }}
              color="success"
              mode="ios"
            >
              Calculate
            </Button>
            <Button onClick={this._reset} mode="ios" color="danger">
              Reset
            </Button>
          </ButtonContainer>
        </Outer>
      </Page>
    );
  }
}

export default Calculator;
