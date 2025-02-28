import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

export default function Jobinfo({ jobId, workTimes }) {
  const data = workTimes;

  return (
    <div>
      <div>Previous work times:</div>
      <div>
        {data.length !== 0 &&
          data.map((workTimes) => (
            <div key={workTimes.id}>
              {dayjs(workTimes.start.toDate()).format("YYYY-MM-DD HH:mm")} -{" "}
              {dayjs(workTimes.stop.toDate()).format("YYYY-MM-DD HH:mm")}
            </div>
          ))}
      </div>
    </div>
  );
}

Jobinfo.propTypes = {
  jobId: PropTypes.any,
  workTimes: PropTypes.any,
};
