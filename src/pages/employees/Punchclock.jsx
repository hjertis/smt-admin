//eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import useFirebase from "../../hooks/useFirebase";
import dayjs from "dayjs";
import { punchclockLimit } from "../../data/data";

export default function Punchclock({ employeeId }) {
  const { data } = useFirebase(`employees/${employeeId}/punchclock`);
  const punchclockData = data.slice(punchclockLimit);

  const totalTime = punchclockData.reduce((acc, current) => {
    const startDate = new Date(current.start.seconds * 1000);
    const stopDate = new Date(current.stop.seconds * 1000);
    const elapsedTime = stopDate.getTime() - startDate.getTime();
    const hours = elapsedTime / (1000 * 60 * 60);
    return acc + hours;
  }, 0);

  const totalHours = Math.floor(totalTime);
  const totalMinutes = Math.floor((totalTime % 1) * 60);
  const totalTimeString = `${totalHours}h ${totalMinutes}m`;

  return (
    <div>
      {punchclockData.map((punchclock, index) => {
        const startDate = punchclock.start.toDate();
        const stopDate = punchclock.stop.toDate();

        const elapsedTime = stopDate.getTime() - startDate.getTime();
        const elapsedHours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const elapsedMinutes = Math.floor(
          (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        return (
          <div key={index}>
            {dayjs(punchclock.start.toDate()).format("YYYY-MM-DD HH:mm:ss")} -{" "}
            {dayjs(punchclock.stop.toDate()).format("YYYY-MM-DD HH:mm:ss")}{" "}
            {" - "}Worked hours: {elapsedHours}h {elapsedMinutes}m{" "}
            {elapsedSeconds}s on OrderNo: {punchclock.orderNo}
          </div>
        );
      })}
      <p>Total hours: {totalTimeString}</p>
    </div>
  );
}

Punchclock.propTypes = {
  employeeId: PropTypes.string,
};
