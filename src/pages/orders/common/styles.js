export const styles = {
  container: {
    padding: "16px",
    maxWidth: "1200px", // Increased from 1024px
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  calendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
  },
  monthTitle: {
    fontSize: "20px",
    fontWeight: "600",
  },
  navButton: {
    background: "none",
    border: "none",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonsContainer: {
    display: "flex",
    gap: "8px",
  },
  dayNamesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
  },
  dayName: {
    padding: "8px 0",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "14px",
    color: "#718096",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
  },
  dateCell: {
    height: "220px", // Increased from 180px to accommodate multi-day events
    border: "1px solid #e2e8f0",
    padding: "8px", // Increased from 4px
    overflow: "hidden",
    position: "relative",
  },
  emptyCell: {
    height: "220px", // Increased from 180px to match dateCell
    border: "1px solid #e2e8f0",
    backgroundColor: "#f7fafc",
  },
  dateNumber: {
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "8px", // Increased from 4px
  },
  workOrdersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px", // Increased from 4px
    overflowY: "auto",
    maxHeight: "140px", // Increased from 96px
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e0 #f7fafc",
  },
  workOrderItem: {
    fontSize: "13px", // Increased from 12px
    padding: "6px", // Increased from 4px
    borderRadius: "4px",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    backgroundColor: "#f7fafc",
    minHeight: "24px", // Added for more clickable area
  },
  workOrderItemDragging: {
    opacity: "0.6",
    cursor: "grabbing",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  dragHandle: {
    cursor: "grab",
    marginRight: "4px",
    display: "flex",
    alignItems: "center",
  },
  detailsContainer: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  detailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailsTitle: {
    fontSize: "18px",
    fontWeight: "600",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#a0aec0",
    cursor: "pointer",
  },
  detailsContent: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  detailLabel: {
    color: "#718096",
  },
  detailValue: {
    fontWeight: "500",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
  },
  buttonsContainer: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  editButton: {
    padding: "4px 12px",
    backgroundColor: "#ebf8ff",
    color: "#3182ce",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeDetailsButton: {
    padding: "4px 12px",
    backgroundColor: "#f7fafc",
    color: "#4a5568",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  legendContainer: {
    marginTop: "24px",
  },
  legendTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  legendItems: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    marginRight: "4px",
  },
  iconHigh: {
    color: "#e53e3e",
    marginRight: "4px",
  },
  iconMedium: {
    color: "#dd6b20",
    marginRight: "4px",
  },
  iconLow: {
    color: "#3182ce",
    marginRight: "4px",
  },
  durationBadge: {
    fontSize: "10px",
    padding: "1px 4px",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "4px",
    marginLeft: "4px",
  },
  notificationToast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#38a169",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: "1000",
    transition: "opacity 0.3s ease",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
};

export const statusColors = {
  finished: { background: "#c6f6d5", text: "#2f855a" },
  "in progress": { background: "#bee3f8", text: "#2c5282" },
  inprogress: { background: "#bee3f8", text: "#2c5282" },
  scheduled: { background: "#e9d8fd", text: "#553c9a" },
  assigned: { background: "#e9d8fd", text: "#553c9a" },
  pending: { background: "#fefcbf", text: "#744210" },
  waiting: { background: "#fefcbf", text: "#744210" },
  hmt: { background: "#fed7d7", text: "#822727" },
  cancelled: { background: "#e2e8f0", text: "#4a5568" },
};
