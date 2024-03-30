import { PollStatus } from "@xd/database";
import ManagePollTrigger from "./abstractManagePoll";

class CancelPollTrigger extends ManagePollTrigger {
  pollStatus = PollStatus.CANCELED;

  callback = /cancelPoll_/;

  description = "Cancel poll.";

  successMessage = "Poll cancelled.";
}

const cancelPollTrigger = new CancelPollTrigger();

export default cancelPollTrigger;
