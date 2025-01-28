//eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import useFirebase from "../../hooks/useFirebase";
import dayjs from "dayjs";

export default function Punchclock({ employeeId }) {
  const { data } = useFirebase(`employees/${employeeId}/punchclock`);
  return (
    <div>
      {data.map((punchclock, index) => {
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
            {elapsedSeconds}s
          </div>
        );
      })}
    </div>
  );
}

Punchclock.propTypes = {
  employeeId: PropTypes.string,
};
