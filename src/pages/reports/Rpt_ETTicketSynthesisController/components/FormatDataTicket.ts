export function groupTicketsByDate(input: any) {
  const output: any = [];
  const dateMap = new Map();

  input?.forEach((ticket: any) => {
    const createDate = ticket.CreateDate.split("T")[0];

    if (!dateMap.has(createDate)) {
      dateMap.set(createDate, {
        Closed: 0,
        Open: 0,
        New: 0,
        Processing: 0,
        Resolved: 0,
      });
    }

    if (ticket.AgentTicketStatusName === "Closed") {
      dateMap.get(createDate).Closed += ticket.QtyTicket;
    } else if (ticket.AgentTicketStatusName === "Open") {
      dateMap.get(createDate).Open += ticket.QtyTicket;
    } else if (ticket.AgentTicketStatusName === "New") {
      dateMap.get(createDate).New += ticket.QtyTicket;
    } else if (ticket.AgentTicketStatusName === "Processing") {
      dateMap.get(createDate).Processing += ticket.QtyTicket;
    } else if (ticket.AgentTicketStatusName === "Resolved") {
      dateMap.get(createDate).Resolved += ticket.QtyTicket;
    }
  });

  dateMap?.forEach((value, createDate) => {
    output.push({
      CreateDate: createDate,
      Closed: value.Closed,
      Open: value.Open,
      New: value.New,
      Processing: value.Processing,
      Resolved: value.Resolved,
    });
  });

  return output;
}

export const architectureSources = [
  { value: "New", name: "Create", color: "#0FBC2B" },
  { value: "Open", name: "Open", color: "#CFB929" },
  { value: "Processing", name: "Processing", color: "#E48203" },
  { value: "Closed", name: "Closed", color: "#298EF2" },
  { value: "Resolved", name: "Resolved", color: "#A7A7A7" },
];
