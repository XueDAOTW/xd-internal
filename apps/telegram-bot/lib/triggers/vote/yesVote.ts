import { VoteType } from "@xd/database";
import VoteTrigger from "./abstractVote";

class YesVoteTrigger extends VoteTrigger {
  voteType = VoteType.YES;

  callback = /yes_/;

  description = "Vote yes on a poll";
}

const yesVoteTrigger = new YesVoteTrigger();

export default yesVoteTrigger;
