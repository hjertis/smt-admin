import React from "react";
import {
  KanbanComponent,
  ColumnDirective,
  ColumnsDirective,
} from "@syncfusion/ej2-react-kanban";
import useFirebase from "../hooks/useFirebase";

export default function Scheduler() {
  const kanbanRef = React.useRef();
  const { data, loading, error } = useFirebase("newOrders");

  const kanbanData = data.map((order) => ({
    Id: order.orderNumber,
    Summary:
      order.partNo +
      " - " +
      order.description +
      " (" +
      order.quantity +
      "stk.)",
    Status: order.status,
  }));

  const cardSettings = {
    contentField: "Summary",
    headerField: "Id",
  };

  return (
    <KanbanComponent
      dataSource={kanbanData}
      keyField="Status"
      cardSettings={cardSettings}
      actionComplete={(args) => {
        if (args.requestType === "cardChanged") {
          console.log("Card changed", args);
        } else if (args.requestType === "cardRemoved") {
          console.log("Card removed", args);
        }
      }}>
      <ColumnsDirective>
        <ColumnDirective headerText="New" keyField="Firm Planned" />
        <ColumnDirective headerText="In Progress" keyField="Released" />
        <ColumnDirective
          headerText="Done"
          keyField="Finished"
          allowToggle={true}
          isExpanded={false}
        />
      </ColumnsDirective>
    </KanbanComponent>
  );
}
