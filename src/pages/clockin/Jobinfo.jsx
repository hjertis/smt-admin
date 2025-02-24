import React from "react";
import PropTypes from "prop-types";
import useFirebase from "../../hooks/useFirebase";
import dayjs from "dayjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function Jobinfo({ jobId }) {
  const { data } = useFirebase(`newOrders/${jobId}/workTimes`);

  React.useEffect(() => {
    const worktimesRef = collection(db, "newOrders", jobId, "workTimes");
    const worktimesSnap = getDocs(worktimesRef);
    console.log(worktimesSnap);
  }, []);

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
};
