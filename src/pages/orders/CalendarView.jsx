import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Warning,
  CalendarToday,
  Close,
  Menu,
  CheckCircle,
  MoreVert,
} from "@mui/icons-material";
import { styles, statusColors } from "./common/styles";
import { dayNames, monthNames } from "./common/data";
import PropTypes from "prop-types";

const CalendarView = ({
  workOrders = [],
  onWorkOrderMove = () => {},
  onWorkOrderSelect = () => {},
  initialDate = new Date(),
  title = "Work Order Calendar",
  maxVisibleOrders = 5,
}) => {
  // State management
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [internalWorkOrders, setInternalWorkOrders] = useState(workOrders);
  const [draggedWorkOrder, setDraggedWorkOrder] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [expandedCell, setExpandedCell] = useState(null);
  const [monthLayout, setMonthLayout] = useState(null); // For tracking multi-day event positions

  // Refs for drag and drop
  const calendarRef = useRef(null);

  // Update internal state when external props change
  useEffect(() => {
    setInternalWorkOrders(workOrders);
  }, [workOrders]);

  // Calculate month layout when month changes or work orders change
  useEffect(() => {
    calculateMonthLayout();
  }, [currentDate, internalWorkOrders]);

  // Show a notification toast
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // Calendar navigation functions
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setExpandedCell(null);
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setExpandedCell(null);
  };

  // Calculate layout for consistent multi-day event positioning
  const calculateMonthLayout = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    // Initialize the month layout
    const layout = {};
    for (let day = 1; day <= daysInMonth; day++) {
      layout[day] = {
        slots: [], // Will contain work order IDs in each slot
        maxSlot: -1, // Maximum slot index used
      };
    }

    // First, identify multi-day events and their date ranges
    const multiDayEvents = [];
    internalWorkOrders.forEach((wo) => {
      const startDate =
        wo.start instanceof Date
          ? wo.start
          : new Date(wo.start?.seconds * 1000 || 0);

      const endDate =
        wo.end instanceof Date ? wo.end : new Date(wo.end?.seconds * 1000 || 0);

      const startDay = startDate.getDate();
      const startMonth = startDate.getMonth();
      const startYear = startDate.getFullYear();

      const endDay = endDate.getDate();
      const endMonth = endDate.getMonth();
      const endYear = endDate.getFullYear();

      // Only include events relevant to current month
      if (
        (startYear === year && startMonth === month) ||
        (endYear === year && endMonth === month)
      ) {
        // Calculate the visible day range in this month
        const visibleStartDay =
          startYear === year && startMonth === month ? startDay : 1;

        const visibleEndDay =
          endYear === year && endMonth === month ? endDay : daysInMonth;

        multiDayEvents.push({
          id: wo.id,
          startDay: visibleStartDay,
          endDay: visibleEndDay,
          priority: wo.priority?.toLowerCase() || "low",
          data: wo,
        });
      }
    });

    // Sort multi-day events by duration (longest first), then by priority (highest first)
    multiDayEvents.sort((a, b) => {
      const aDuration = a.endDay - a.startDay;
      const bDuration = b.endDay - b.startDay;

      if (bDuration !== aDuration) {
        return bDuration - aDuration; // Longest events first
      }

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Assign slots to multi-day events
    multiDayEvents.forEach((event) => {
      // Find the first available slot across all days the event spans
      let slotIndex = 0;
      let slotFound = false;

      while (!slotFound) {
        slotFound = true;

        // Check if this slot is available for all days
        for (let day = event.startDay; day <= event.endDay; day++) {
          if (layout[day].slots[slotIndex]) {
            slotFound = false;
            break;
          }
        }

        if (!slotFound) {
          slotIndex++;
        }
      }

      // Assign the event to the found slot for all days it spans
      for (let day = event.startDay; day <= event.endDay; day++) {
        layout[day].slots[slotIndex] = event.id;
        layout[day].maxSlot = Math.max(layout[day].maxSlot, slotIndex);
      }
    });

    setMonthLayout(layout);
  };

  // Get days for the current month view
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    // Convert Sunday (0) through Saturday (6) to Monday (0) through Sunday (6)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Sunday becomes 6, others shift down by 1
  };

  // Check if a work order is visible on a specific date
  const isWorkOrderVisibleOnDate = (workOrder, date) => {
    // Convert Firebase Timestamp or Date object to JavaScript Date
    const startDate =
      workOrder.start instanceof Date
        ? workOrder.start
        : new Date(workOrder.start?.seconds * 1000 || 0);

    const endDate =
      workOrder.end instanceof Date
        ? workOrder.end
        : new Date(workOrder.end?.seconds * 1000 || 0);

    // Create date objects for the start of the day and end of the day
    const dayStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    const dayEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date,
      23,
      59,
      59
    );

    // Check if the work order date range overlaps with the current day
    return startDate <= dayEnd && endDate >= dayStart;
  };

  // Get work orders for a specific date
  const getWorkOrdersForDate = (date) => {
    return internalWorkOrders.filter((wo) =>
      isWorkOrderVisibleOnDate(wo, date)
    );
  };

  // Get single-day work orders for a specific date (not spanning multiple days)
  const getSingleDayWorkOrdersForDate = (date) => {
    return internalWorkOrders.filter((wo) => {
      const startDate =
        wo.start instanceof Date
          ? wo.start
          : new Date(wo.start?.seconds * 1000 || 0);

      const endDate =
        wo.end instanceof Date ? wo.end : new Date(wo.end?.seconds * 1000 || 0);

      // Check if it's visible on this date
      if (!isWorkOrderVisibleOnDate(wo, date)) {
        return false;
      }

      // Calculate if it's a single day event or if this day is not part of a multi-day span
      const startDay = startDate.getDate();
      const startMonth = startDate.getMonth();
      const startYear = startDate.getFullYear();

      const endDay = endDate.getDate();
      const endMonth = endDate.getMonth();
      const endYear = endDate.getFullYear();

      const isSingleDay =
        startDay === endDay && startMonth === endMonth && startYear === endYear;

      // Include only single-day events or multi-day events on their start day
      return (
        isSingleDay ||
        (startDay === date &&
          startMonth === currentDate.getMonth() &&
          startYear === currentDate.getFullYear())
      );
    });
  };

  // Get multi-day work orders that have an assigned slot for this date
  const getMultiDayWorkOrdersForDate = (date) => {
    if (!monthLayout || !monthLayout[date]) return [];

    const layout = monthLayout[date];
    return layout.slots
      .map((workOrderId, slotIndex) => {
        if (!workOrderId) return null;

        const workOrder = internalWorkOrders.find(
          (wo) => wo.id === workOrderId
        );
        if (!workOrder) return null;

        return {
          ...workOrder,
          slotIndex,
        };
      })
      .filter(Boolean);
  };

  // Create a new date from year, month, day
  const createDate = (year, month, day) => {
    return new Date(year, month, day);
  };

  // Handle drag start
  const handleDragStart = (e, workOrder) => {
    setDraggedWorkOrder(workOrder);
    e.currentTarget.style.opacity = "0.4";
    e.dataTransfer.effectAllowed = "move";

    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.textContent =
      workOrder.title || workOrder.description || "Work Order";
    dragImage.style.padding = "8px";
    dragImage.style.background = "#e2e8f0";
    dragImage.style.borderRadius = "4px";
    dragImage.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);

    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Remove the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 100);
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedWorkOrder(null);
  };

  // Handle drag over
  const handleDragOver = (e, day) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop
  const handleDrop = (e, day) => {
    e.preventDefault();

    if (draggedWorkOrder) {
      // Create new date for the dropped position
      const newStartDate = createDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      // Calculate the duration in milliseconds of the original work order
      const originalStartDate =
        draggedWorkOrder.start instanceof Date
          ? draggedWorkOrder.start
          : new Date(draggedWorkOrder.start?.seconds * 1000 || 0);

      const originalEndDate =
        draggedWorkOrder.end instanceof Date
          ? draggedWorkOrder.end
          : new Date(draggedWorkOrder.end?.seconds * 1000 || 0);

      const durationMs =
        originalEndDate.getTime() - originalStartDate.getTime();

      // Calculate new end date by adding the same duration
      const newEndDate = new Date(newStartDate.getTime() + durationMs);

      // Create updated work order with new dates
      let updatedWorkOrder;

      if (draggedWorkOrder.start?.seconds !== undefined) {
        // Firebase Timestamp format
        updatedWorkOrder = {
          ...draggedWorkOrder,
          start: {
            seconds: Math.floor(newStartDate.getTime() / 1000),
            nanoseconds: 0,
          },
          end: {
            seconds: Math.floor(newEndDate.getTime() / 1000),
            nanoseconds: 0,
          },
        };
      } else {
        // Regular Date object format
        updatedWorkOrder = {
          ...draggedWorkOrder,
          start: newStartDate,
          end: newEndDate,
        };
      }

      // Update internal state
      const updatedWorkOrders = internalWorkOrders.map((wo) => {
        if (wo.id === draggedWorkOrder.id) {
          return updatedWorkOrder;
        }
        return wo;
      });

      setInternalWorkOrders(updatedWorkOrders);

      // Call external handler with the updated work order
      onWorkOrderMove(updatedWorkOrder, updatedWorkOrders);

      // Show notification
      showToast(
        `Moved "${
          draggedWorkOrder.description ||
          draggedWorkOrder.title ||
          draggedWorkOrder.orderNumber ||
          "Work Order"
        }" to ${newStartDate.toLocaleDateString()}`
      );
    }
  };

  // Handle "Show More" click to expand a cell
  const handleExpandCell = (day, event) => {
    event.stopPropagation();
    if (expandedCell === day) {
      setExpandedCell(null);
    } else {
      setExpandedCell(day);
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <Warning style={styles.iconHigh} size={16} />;
      case "medium":
        return <CalendarToday style={styles.iconMedium} size={16} />;
      case "low":
        return <Info style={styles.iconLow} size={16} />;
      default:
        return null;
    }
  };

  // Get priority color style
  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
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

  // Render a work order item
  const renderWorkOrderItem = (
    wo,
    day,
    isMultiDay = false,
    slotIndex = 0,
    isFirstDay = false
  ) => {
    // Calculate duration in days
    const startTimestamp =
      wo.start instanceof Date
        ? wo.start.getTime()
        : new Date(wo.start?.seconds * 1000 || 0).getTime();

    const endTimestamp =
      wo.end instanceof Date
        ? wo.end.getTime()
        : new Date(wo.end?.seconds * 1000 || 0).getTime();

    const durationDays = Math.ceil(
      (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24)
    );

    // If not provided, check if this is the first day of the work order
    if (isMultiDay && !isFirstDay) {
      const woStartDate = new Date(startTimestamp);
      isFirstDay =
        woStartDate.getDate() === day &&
        woStartDate.getMonth() === currentDate.getMonth() &&
        woStartDate.getFullYear() === currentDate.getFullYear();
    }

    const isBeingDragged = draggedWorkOrder && draggedWorkOrder.id === wo.id;

    return (
      <div
        key={wo.id}
        draggable={isFirstDay}
        style={{
          ...styles.workOrderItem,
          ...(isBeingDragged ? styles.workOrderItemDragging : {}),
          backgroundColor:
            statusColors[wo.status?.toLowerCase()]?.background ||
            statusColors[wo.state?.toLowerCase()]?.background ||
            "#f7fafc",
          color:
            statusColors[wo.status?.toLowerCase()]?.text ||
            statusColors[wo.state?.toLowerCase()]?.text ||
            "#4a5568",
          borderLeft: isFirstDay
            ? `4px solid ${
                wo.priority?.toLowerCase() === "high"
                  ? "#e53e3e"
                  : wo.priority?.toLowerCase() === "medium"
                  ? "#dd6b20"
                  : "#3182ce"
              }`
            : "none",
          paddingLeft: isFirstDay ? "4px" : "8px",
          ...(isMultiDay && {
            marginTop: `${slotIndex * 30}px`, // Position according to slot
            position: "absolute",
            left: "8px",
            right: "8px",
            zIndex: 1,
          }),
        }}
        onClick={() => {
          setSelectedWorkOrder(wo);
          onWorkOrderSelect(wo);
        }}
        onDragStart={isFirstDay ? (e) => handleDragStart(e, wo) : null}
        onDragEnd={isFirstDay ? handleDragEnd : null}>
        {isFirstDay && (
          <div style={styles.dragHandle}>
            <Menu style={{ fontSize: "16px" }} />
          </div>
        )}

        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}>
          {wo.description || wo.title || wo.orderNumber || "Unnamed Task"}
        </span>

        {isFirstDay && durationDays > 1 && (
          <span style={styles.durationBadge}>{durationDays}d</span>
        )}
      </div>
    );
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

    // Calculate the maximum number of slots needed for multi-day events
    const maxSlots = monthLayout
      ? Math.max(...Object.values(monthLayout).map((day) => day.maxSlot + 1), 0)
      : 0;

    // Cells for days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isExpanded = expandedCell === day;

      // Get multi-day work orders with assigned slots
      const multiDayWorkOrders = getMultiDayWorkOrdersForDate(day);

      // Get single-day work orders (or first day of multi-day orders)
      const singleDayWorkOrders = getSingleDayWorkOrdersForDate(day);

      // Calculate space needed for multi-day events
      const multiDaySpace = maxSlots * 30; // 30px per slot

      // Determine which work orders to display
      let displayWorkOrders = singleDayWorkOrders;
      let showMoreCount = 0;

      // Calculate how many single-day events we can show
      const availableHeight = 140 - multiDaySpace; // Adjust based on your cell size
      const maxSingleDayOrders = Math.max(1, Math.floor(availableHeight / 30)); // At least show 1

      if (!isExpanded && singleDayWorkOrders.length > maxSingleDayOrders) {
        displayWorkOrders = singleDayWorkOrders.slice(0, maxSingleDayOrders);
        showMoreCount = singleDayWorkOrders.length - maxSingleDayOrders;
      }

      dateCells.push(
        <div
          key={`day-${day}`}
          data-day={day}
          style={{
            ...styles.dateCell,
            backgroundColor: "white",
            position: "relative", // For absolute positioning of multi-day events
          }}
          onDragOver={(e) => handleDragOver(e, day)}
          onDrop={(e) => handleDrop(e, day)}>
          <div style={styles.dateNumber}>{day}</div>

          {/* Multi-day work orders (positioned absolutely) */}
          {multiDayWorkOrders.map((wo) =>
            renderWorkOrderItem(
              wo,
              day,
              true,
              wo.slotIndex,
              // Check if this is the first day
              wo.start instanceof Date
                ? wo.start.getDate() === day &&
                    wo.start.getMonth() === currentDate.getMonth() &&
                    wo.start.getFullYear() === currentDate.getFullYear()
                : new Date(wo.start?.seconds * 1000).getDate() === day &&
                    new Date(wo.start?.seconds * 1000).getMonth() ===
                      currentDate.getMonth() &&
                    new Date(wo.start?.seconds * 1000).getFullYear() ===
                      currentDate.getFullYear()
            )
          )}

          {/* Single-day work orders (with spacing for multi-day events) */}
          <div
            style={{
              ...styles.workOrdersContainer,
              maxHeight: isExpanded
                ? "400px"
                : styles.workOrdersContainer.maxHeight,
              marginTop: `${multiDaySpace + 10}px`, // Add spacing for multi-day events
            }}>
            {displayWorkOrders.map((wo) => renderWorkOrderItem(wo, day))}

            {showMoreCount > 0 && (
              <div
                style={{
                  ...styles.workOrderItem,
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={(e) => handleExpandCell(day, e)}>
                <MoreVert style={{ fontSize: "16px", marginRight: "4px" }} />
                Show {showMoreCount} more orders
              </div>
            )}

            {isExpanded && (
              <div
                style={{
                  ...styles.workOrderItem,
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={(e) => handleExpandCell(day, e)}>
                <Close style={{ fontSize: "16px", marginRight: "4px" }} />
                Collapse
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.calendarContainer} ref={calendarRef}>
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
              <ChevronLeft style={{ fontSize: "24px" }} />
            </button>
            <button
              onClick={nextMonth}
              style={styles.navButton}
              aria-label="Next Month">
              <ChevronRight style={{ fontSize: "24px" }} />
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

    // Convert dates from timestamps if needed
    const startDate =
      selectedWorkOrder.start instanceof Date
        ? selectedWorkOrder.start
        : new Date(selectedWorkOrder.start?.seconds * 1000 || 0);

    const endDate =
      selectedWorkOrder.end instanceof Date
        ? selectedWorkOrder.end
        : new Date(selectedWorkOrder.end?.seconds * 1000 || 0);

    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Get status style
    const statusStyle = statusColors[selectedWorkOrder.status?.toLowerCase()] ||
      statusColors[selectedWorkOrder.state?.toLowerCase()] || {
        background: "#edf2f7",
        text: "#4a5568",
      };

    return (
      <div style={styles.detailsContainer}>
        <div style={styles.detailsHeader}>
          <h3 style={styles.detailsTitle}>
            {selectedWorkOrder.description ||
              selectedWorkOrder.title ||
              "Work Order Details"}
          </h3>
          <button
            onClick={() => setSelectedWorkOrder(null)}
            style={styles.closeButton}>
            <Close style={{ fontSize: "24px" }} />
          </button>
        </div>

        <div style={styles.detailsContent}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>ID:</span>
            <span style={styles.detailValue}>{selectedWorkOrder.id}</span>
          </div>

          {selectedWorkOrder.orderNumber && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Order Number:</span>
              <span style={styles.detailValue}>
                {selectedWorkOrder.orderNumber}
              </span>
            </div>
          )}

          {selectedWorkOrder.partNo && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Part Number:</span>
              <span style={styles.detailValue}>{selectedWorkOrder.partNo}</span>
            </div>
          )}

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Start Date:</span>
            <span style={styles.detailValue}>
              {startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>End Date:</span>
            <span style={styles.detailValue}>
              {endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Duration:</span>
            <span style={styles.detailValue}>
              {durationDays} day{durationDays > 1 ? "s" : ""}
            </span>
          </div>

          {(selectedWorkOrder.status || selectedWorkOrder.state) && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status:</span>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: statusStyle.background,
                  color: statusStyle.text,
                }}>
                {(selectedWorkOrder.status || selectedWorkOrder.state)
                  .charAt(0)
                  .toUpperCase() +
                  (selectedWorkOrder.status || selectedWorkOrder.state).slice(
                    1
                  )}
              </span>
            </div>
          )}

          {selectedWorkOrder.priority && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Priority:</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  ...getPriorityStyle(selectedWorkOrder.priority),
                }}>
                {getPriorityIcon(selectedWorkOrder.priority)}
                <span
                  style={{ marginLeft: "4px", textTransform: "capitalize" }}>
                  {selectedWorkOrder.priority}
                </span>
              </span>
            </div>
          )}

          {selectedWorkOrder.assignee && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Assigned to:</span>
              <span style={styles.detailValue}>
                {selectedWorkOrder.assignee}
              </span>
            </div>
          )}

          {selectedWorkOrder.location && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Location:</span>
              <span style={styles.detailValue}>
                {selectedWorkOrder.location}
              </span>
            </div>
          )}

          {selectedWorkOrder.quantity && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Quantity:</span>
              <span style={styles.detailValue}>
                {selectedWorkOrder.quantity}
              </span>
            </div>
          )}

          {selectedWorkOrder.notes && (
            <div
              style={{
                ...styles.detailRow,
                flexDirection: "column",
                marginTop: "8px",
              }}>
              <span style={styles.detailLabel}>Notes:</span>
              <div
                style={{
                  ...styles.detailValue,
                  marginTop: "4px",
                  whiteSpace: "pre-wrap",
                }}>
                {selectedWorkOrder.notes}
              </div>
            </div>
          )}
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
            <Warning style={{ ...styles.iconHigh, fontSize: "16px" }} />
            <span>High Priority</span>
          </div>
          <div style={styles.legendItem}>
            <CalendarToday style={{ ...styles.iconMedium, fontSize: "16px" }} />
            <span>Medium Priority</span>
          </div>
          <div style={styles.legendItem}>
            <Info style={{ ...styles.iconLow, fontSize: "16px" }} />
            <span>Low Priority</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendColor,
                backgroundColor: statusColors.finished.background,
              }}></div>
            <span>Finished</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendColor,
                backgroundColor: statusColors["in progress"].background,
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
          <div style={styles.legendItem}>
            <Menu style={{ fontSize: "16px", marginRight: "4px" }} />
            <span>Drag to move</span>
          </div>
          <div style={styles.legendItem}>
            <MoreVert style={{ fontSize: "16px", marginRight: "4px" }} />
            <span>More orders</span>
          </div>
        </div>
      </div>
    );
  };

  // Render notification toast
  const renderToast = () => {
    if (!toast.show) return null;

    return (
      <div style={styles.notificationToast}>
        <CheckCircle size={16} style={{ marginRight: "8px" }} />
        {toast.message}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title}</h1>

      {renderCalendar()}
      {renderWorkOrderDetails()}
      {renderLegend()}
      {renderToast()}
    </div>
  );
};

// PropTypes definition
CalendarView.propTypes = {
  // Array of work order objects
  workOrders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
      orderNumber: PropTypes.string,
      start: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.shape({
          seconds: PropTypes.number,
          nanoseconds: PropTypes.number,
        }),
      ]).isRequired,
      end: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.shape({
          seconds: PropTypes.number,
          nanoseconds: PropTypes.number,
        }),
      ]).isRequired,
      status: PropTypes.string,
      state: PropTypes.string,
      priority: PropTypes.string,
      partNo: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      notes: PropTypes.string,
    })
  ),
  // Callback when a work order is moved to a new date
  onWorkOrderMove: PropTypes.func,
  // Callback when a work order is selected
  onWorkOrderSelect: PropTypes.func,
  // Initial date to display in the calendar
  initialDate: PropTypes.instanceOf(Date),
  // Calendar title
  title: PropTypes.string,
  // Maximum number of orders to show before "more" button
  maxVisibleOrders: PropTypes.number,
};

export default CalendarView;
