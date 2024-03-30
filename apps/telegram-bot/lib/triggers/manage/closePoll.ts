import { PollStatus } from "@xd/database";
import ManagePollTrigger from "./abstractManagePoll";

class ClosePollTrigger extends ManagePollTrigger {
  pollStatus = PollStatus.CLOSED;

  callback = /closePoll_/;

  description = "Close poll and end voting";

  successMessage = "Poll closed. No new votes will be accepted.";
}

const closePollTrigger = new ClosePollTrigger();

export default closePollTrigger;
