import React, { useEffect, useRef, useState } from "react";
import sound from "./mixkit-clock-countdown-bleeps-916.wav";
function Main() {
  const [timer, setTimer] = useState(1500);
  const [isCounting, setIsCounting] = useState(false);
  const [isRelax, setRelax] = useState(false);
  const [audio] = useState(new Audio(sound));
  const [prevResults, setPrevious] = useState(() =>
    !localStorage.getItem("results")
      ? []
      : JSON.parse(localStorage.getItem("results"))
  );

  const timerInterval = useRef(null);

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);
    setIsCounting(true);
  };

  const stopTimer = () => {
    clearInterval(timerInterval.current);
    setIsCounting(false);
  };

  const handleReset = () => {
    clearInterval(timerInterval.current);
    setIsCounting(false);
    setTimer(1500);
  };

  useEffect(() => {
    if (timer === 0 && !isRelax) {
      audio.play();
      let now = new Date();
      let date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      date += ` ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setPrevious((prevState) => [...prevState, date]);
      setTimer(300);
      setRelax(true);
      return;
    } else if (timer === 0 && isRelax) {
      audio.play();
      setTimer(1500);
      setRelax(false);
      return;
    }
  }, [timer]);

  useEffect(() => {
    if (prevResults.length !== 0)
      localStorage.setItem("results", JSON.stringify(prevResults));
  }, [prevResults]);

  return (
    <div className="main-block">
      <i className="large material-icons">timer</i>
      <div>
        <p className="timer grey-text text-lighten-4">{timer}</p>
        <div>
          {!isCounting ? (
            <a
              className="waves-effect waves-light btn"
              href="#!"
              onClick={startTimer}
            >
              Start
            </a>
          ) : (
            <a
              className="waves-effect waves-light btn"
              href="#!"
              onClick={stopTimer}
            >
              Stop
            </a>
          )}
          <a
            className="waves-effect waves-light btn"
            href="#!"
            onClick={handleReset}
          >
            Reset
          </a>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export { Main };
