import { Vote, VoteType } from "@xd/database";

export const getVoteCountsText = (
  votes: Vote[],
  ipId: number,
  title: string,
) => {
  const voteLists = votes.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.voteType].push(currentValue);
      return accumulator;
    },
    {
      YES: [],
      NO: [],
      ABSTAIN: [],
    } as Record<VoteType, Vote[]>,
  );

  const yesPercentage = Math.round((voteLists.YES.length / votes.length) * 100);
  const noPercentage = Math.round((voteLists.NO.length / votes.length) * 100);
  const abstainPercentage = Math.round(
    (voteLists.ABSTAIN.length / votes.length) * 100,
  );

  const text = `Vote Counts: <b>XIP ${ipId} ${title}</b>

🙋 Yes ${voteLists.YES.length}
${"|||".repeat(Math.round(yesPercentage / 10))} ${yesPercentage || 0}%

🙅 No ${voteLists.NO.length}
${"|||".repeat(Math.round(noPercentage / 10))} ${noPercentage || 0}%

🤷 Abstain ${voteLists.ABSTAIN.length}
${"|||".repeat(Math.round(abstainPercentage / 10))} ${abstainPercentage || 0}%

Total votes: ${votes.length}`;
  return text;
};
