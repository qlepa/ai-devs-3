import Week from "../components/week";
import Day1 from "./components/day1";
import Day2 from "./components/day2";

export default function Week1() {
  const days = {
    1: <Day1 />,
    2: <Day2 />,
    3: <div>Dzień 3</div>,
    4: <div>Dzień 4</div>,
    5: <div>Dzień 5</div>,
  };

  return <Week weekNumber={1} days={days} />;
}
