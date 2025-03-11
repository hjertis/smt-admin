import React, { useState, useEffect } from "react";
import {
  ChevronLeft as KeyboardArrowLeft,
  ChevronRight as KeyboardArrowRight,
  Info,
  Warning,
  CalendarToday as Schedule,
  Close,
} from "@mui/icons-material";
import { styles, statusColors } from "./common/styles";
import { dayNames, monthNames } from "./common/data";

// Status colors

const CalendarView = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);

  // Sample work order data - replace with your actual data source
  useEffect(() => {
    // This would typically be an API call
    const sampleWorkOrders = [
      {
        id: "WO-1001",
        title: "HVAC Maintenance",
        date: new Date(2025, 2, 12),
        status: "scheduled",
        priority: "medium",
        assignee: "Alex Johnson",
        location: "Building A, Floor 3",
      },
      {
        id: "WO-1002",
        title: "Plumbing Repair",
        date: new Date(2025, 2, 15),
        status: "in-progress",
        priority: "high",
        assignee: "Sam Rodriguez",
        location: "Building B, Room 201",
      },
      {
        id: "WO-1003",
        title: "Electrical Inspection",
        date: new Date(2025, 2, 18),
        status: "pending",
        priority: "low",
        assignee: "Taylor Smith",
        location: "Building C, Basement",
      },
      {
        id: "WO-1004",
        title: "Window Replacement",
        date: new Date(2025, 2, 22),
        status: "scheduled",
        priority: "medium",
        assignee: "Jordan Lee",
        location: "Building A, Floor 2",
      },
      {
        id: "WO-1005",
        title: "Roof Inspection",
        date: new Date(2025, 2, 5),
        status: "completed",
        priority: "medium",
        assignee: "Morgan Parker",
        location: "Building D",
      },
      {
        id: "WO-1006",
        title: "Lighting Upgrade",
        date: new Date(2025, 2, 8),
        status: "scheduled",
        priority: "low",
        assignee: "Alex Johnson",
        location: "Building B, All Floors",
      },
      {
        id: "WO-1007",
        title: "Emergency Generator Test",
        date: new Date(2025, 2, 15),
        status: "scheduled",
        priority: "high",
        assignee: "Casey Wilson",
        location: "Central Power Plant",
      },
    ];
    setWorkOrders(sampleWorkOrders);
  }, []);

  // Calendar navigation functions
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Get days for the current month view
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get work orders for a specific date
  const getWorkOrdersForDate = (date) => {
    return workOrders.filter(
      (wo) =>
        wo.date.getDate() === date &&
        wo.date.getMonth() === currentDate.getMonth() &&
        wo.date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Warning style={styles.iconHigh} size={16} />;
      case "medium":
        return <Schedule style={styles.iconMedium} size={16} />;
      case "low":
        return <Info style={styles.iconLow} size={16} />;
      default:
        return null;
    }
  };

  // Get priority color style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return { color: "#e53e3e" };
      case "medium":
        return { color: "#dd6b20" };
      case "low":
        return { color: "#3182ce" };
      default:
        return { color: "#718096" };
    }
  };

  // Render the calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Create date cells
    const dateCells = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dateCells.push(<div key={`empty-${i}`} style={styles.emptyCell}></div>);
    }

    // Cells for days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const workOrdersForDay = getWorkOrdersForDate(day);

      dateCells.push(
        <div
          key={`day-${day}`}
          style={{
            ...styles.dateCell,
            backgroundColor: "white",
            ":hover": { backgroundColor: "#f7fafc" },
          }}>
          <div style={styles.dateNumber}>{day}</div>
          <div style={styles.workOrdersContainer}>
            {workOrdersForDay.map((wo) => (
              <div
                key={wo.id}
                style={{
                  ...styles.workOrderItem,
                  ":hover": { backgroundColor: "#f7fafc" },
                }}
                onClick={() => setSelectedWorkOrder(wo)}>
                {getPriorityIcon(wo.priority)}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {wo.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.calendarContainer}>
        {/* Calendar header */}
        <div style={styles.calendarHeader}>
          <h2 style={styles.monthTitle}>
            {monthNames[month]} {year}
          </h2>
          <div style={styles.navButtonsContainer}>
            <button
              onClick={prevMonth}
              style={styles.navButton}
              aria-label="Previous Month">
              <KeyboardArrowLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              style={styles.navButton}
              aria-label="Next Month">
              <KeyboardArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Day names */}
        <div style={styles.dayNamesContainer}>
          {dayNames.map((day) => (
            <div key={day} style={styles.dayName}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={styles.calendarGrid}>{dateCells}</div>
      </div>
    );
  };

  // Render work order details when selected
  const renderWorkOrderDetails = () => {
    if (!selectedWorkOrder) return null;

    const { id, title, date, status, priority, assignee, location } =
      selectedWorkOrder;

    // Get status style
    const statusStyle = statusColors[status] || {
      background: "#edf2f7",
      text: "#4a5568",
    };

    return (
      <div style={styles.detailsContainer}>
        <div style={styles.detailsHeader}>
          <h3 style={styles.detailsTitle}>{title}</h3>
          <button
            onClick={() => setSelectedWorkOrder(null)}
            style={styles.closeButton}>
            <Close size={20} />
          </button>
        </div>

        <div style={styles.detailsContent}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>ID:</span>
            <span style={styles.detailValue}>{id}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Date:</span>
            <span style={styles.detailValue}>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Status:</span>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: statusStyle.background,
                color: statusStyle.text,
              }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Priority:</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                ...getPriorityStyle(priority),
              }}>
              {getPriorityIcon(priority)}
              <span style={{ marginLeft: "4px", textTransform: "capitalize" }}>
                {priority}
              </span>
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Assigned to:</span>
            <span style={styles.detailValue}>{assignee}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Location:</span>
            <span style={styles.detailValue}>{location}</span>
          </div>
        </div>

        <div style={styles.buttonsContainer}>
          <button style={styles.editButton}>Edit</button>
          <button
            style={styles.closeDetailsButton}
            onClick={() => setSelectedWorkOrder(null)}>
            Close
          </button>
        </div>
      </div>
    );
  };

  // Render legend
  const renderLegend = () => {
    return (
      <div style={styles.legendContainer}>
        <h2 style={styles.legendTitle}>Legend</h2>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <Warning style={styles.iconHigh} size={16} />
            <span>High Priority</span>
          </div>
          <div style={styles.legendItem}>
            <Schedule style={styles.iconMedium} size={16} />
            <span>Medium Priority</span>
          </div>
          <div style={styles.legendItem}>
            <Info style={styles.iconLow} size={16} />
            <span>Low Priority</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendColor,
                backgroundColor: statusColors.completed.background,
              }}></div>
            <span>Completed</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendColor,
                backgroundColor: statusColors["in-progress"].background,
              }}></div>
            <span>In Progress</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendColor,
                backgroundColor: statusColors.scheduled.background,
              }}></div>
            <span>Scheduled</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendColor,
                backgroundColor: statusColors.pending.background,
              }}></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Work Order Calendar</h1>

      {renderCalendar()}
      {renderWorkOrderDetails()}
      {renderLegend()}
    </div>
  );
};

export default CalendarView;
