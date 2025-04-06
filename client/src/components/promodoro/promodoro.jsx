import { useState, useEffect, useReducer } from "react";
import styled from "styled-components";

const initialState = {
  minutes: 25,
  seconds: 0,
  mode: "work",
  cycles: 0, // Nombre de cycles terminés
  isRunning: false,
  settings: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    cyclesBeforeLongBreak: 4,
  },
};

// Composants stylisés
const Container = styled.div`
  max-width: 400px;

  padding: 1rem 0;
  background: #fafafa;
  border-radius: 0.4rem;
`;

const ModeBadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ModeBadge = styled.div`
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-weight: 500;
  color: ${(props) => {
    if (props.isFocused) return "white";
    else return "black";
  }};
  background-color: ${(props) => {
    if (props.isFocused) return "#446C8A";
  }};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    transform: ${(props) => (props.clickable ? "translateY(-2px)" : "none")};
  }
`;

const TimerDisplay = styled.div`
  margin-bottom: 2rem;
`;

const Time = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimeUnit = styled.span`
  font-size: 4rem;
`;

const TimeSeparator = styled.span`
  margin: 0 0.5rem;
`;

const CycleInfo = styled.div`
  font-size: 1rem;
  color: black;
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StartButton = styled(Button)`
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
  }
`;

const StopButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const SkipButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
  }
`;

function TimerReducer(state, action) {
  switch (action.type) {
    case "ACTION_START":
      return { ...state, isRunning: true };
    case "ACTION_TICK":
      if (state.seconds > 0) {
        return {
          ...state,
          seconds: state.seconds - 1,
        };
      } else if (state.minutes > 0) {
        return {
          ...state,
          minutes: state.minutes - 1,
          seconds: 59,
        };
      } else {
        let newCycles = state.cycles;
        let newModes;

        if (state.mode === "work") {
          newCycles = newCycles + 1;

          if (newCycles % state.settings.cyclesBeforeLongBreak === 0) {
            newModes = "longBreak";
          } else {
            newModes = "shortBreak";
          }
        } else {
          newModes = "work";
        }

        const newMinutes =
          newModes === "work"
            ? state.settings.workTime
            : newModes === "shortBreak"
            ? state.settings.shortBreakTime
            : state.settings.longBreakTime;

        return {
          ...state,
          mode: newModes,
          minutes: newMinutes,
          seconds: 0,
          cycles: newCycles,
          isRunning: true,
        };
      }
    case "ACTION_STOP":
      return { ...state, isRunning: false };
    case "ACTION_SKIP":
      let newMode;
      let newCycles = state.cycles;

      if (state.mode === "work") {
        // Après le travail, vérifier si on doit prendre une longue pause
        newCycles = state.cycles + 1;
        if (newCycles % state.settings.cyclesBeforeLongBreak === 0) {
          newMode = "longBreak";
        } else {
          newMode = "shortBreak";
        }
      } else {
        // Après une pause (courte ou longue), revenir au travail
        newMode = "work";
      }

      // Définir la durée appropriée pour le nouveau mode
      const newMinutes =
        newMode === "work"
          ? state.settings.workTime
          : newMode === "shortBreak"
          ? state.settings.shortBreakTime
          : state.settings.longBreakTime;
      return {
        ...state,
        mode: newMode,
        minutes: newMinutes,
        seconds: 0,
        cycles: newCycles,
        isRunning: false,
      };
    case "ACTION_RESET":
      // Réinitialiser le timer au temps défini pour le mode actuel
      return {
        ...state,
        minutes:
          state.mode === "work"
            ? state.settings.workTime
            : state.mode === "shortBreak"
            ? state.settings.shortBreakTime
            : state.settings.longBreakTime,
        seconds: 0,
        isRunning: false,
      };
    default:
      return state;
  }
}

function Promodoro() {
  const [state, dispatch] = useReducer(TimerReducer, initialState);

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: "ACTION_TICK" });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.seconds, state.minutes, state.isRunning]);

  const startTimer = () => {
    dispatch({ type: "ACTION_START" });
  };
  const skipTimer = () => {
    dispatch({ type: "ACTION_SKIP" });
  };
  const stopTimer = () => {
    dispatch({ type: "ACTION_STOP" });
  };

  // Formater les minutes et secondes avec un zéro devant si nécessaire
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  return (
    <Container mode={state.mode}>
      <ModeBadgeContainer>
        <ModeBadge
          modetype="work"
          isFocused={state.mode === "work"}
          clickable={true}
          onClick={() => changeMode("work")}
        >
          Travail
        </ModeBadge>
        <ModeBadge
          modetype="shortBreak"
          isFocused={state.mode === "shortBreak"}
          clickable={true}
          onClick={() => changeMode("shortBreak")}
        >
          Pause Courte
        </ModeBadge>
        <ModeBadge
          modetype="longBreak"
          isFocused={state.mode === "longBreak"}
          clickable={true}
          onClick={() => changeMode("longBreak")}
        >
          Pause Longue
        </ModeBadge>
      </ModeBadgeContainer>

      <TimerDisplay>
        <Time mode={state.mode}>
          <TimeUnit>{formatTime(state.minutes)}</TimeUnit>
          <TimeSeparator>:</TimeSeparator>
          <TimeUnit>{formatTime(state.seconds)}</TimeUnit>
        </Time>
        <CycleInfo>Cycles complétés: {state.cycles}</CycleInfo>
      </TimerDisplay>

      <ButtonContainer>
        {!state.isRunning ? (
          <StartButton onClick={startTimer}>Démarrer</StartButton>
        ) : (
          <StopButton onClick={stopTimer}>Arrêter</StopButton>
        )}
        <SkipButton onClick={skipTimer}>Passer</SkipButton>
      </ButtonContainer>
    </Container>
  );
}

export default Promodoro;
