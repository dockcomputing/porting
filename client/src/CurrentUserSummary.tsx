import * as React from 'react';
import { humanFriendlyNumber } from './utils/number';

export interface CurrentUserSummaryProps {
  tweetCount: number;
  followerCount: number;
  followingCount: number;
}

const CurrentUserSummary: React.FC<CurrentUserSummaryProps> = ({
  tweetCount,
  followerCount,
  followingCount,
}) => (
  <div className="bottom">
    <a href="#">
      <p>Number of records in the porting database</p>
      <h3>{humanFriendlyNumber(tweetCount)}</h3>
    </a>
  </div>
);

export default CurrentUserSummary;
