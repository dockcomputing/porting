import * as React from 'react';
import { gql } from "@apollo/client"
import { useCreateNewTweetMutation } from "./generated/graphql"
import { GET_TIMELINE_TWEETS } from './Timeline';
import { GET_CURRENT_USER } from './App';

export interface ComposePanelProps {
  currentUser: { id: string };
}

export const CREATE_NEW_TWEET = gql`
  mutation CreateNewTweet(
    $userId: String!
    $body: String!
  ) {
    createTweet(userId: $userId, body: $body) {
      id
    }
  }
`;

const ComposePanel: React.FC<ComposePanelProps> = ({ currentUser }) => {
  const [createNewTweet, { error }] =
    useCreateNewTweetMutation();
  if (error) return <p>Error creating new data record: {error}</p>

  const [state, setState] = React.useState({
    phoneNumber: "",
    billingAddress: "",
    password: "",
  })


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textarea = e.currentTarget.querySelector('input')
    if (!textarea) throw new Error('No input found');
    const body = textarea.value;

    if (body.length === 0) {
      return
    }
    
    // Task 1: handle multiple input from form

    // Task 2: call any API here and get back a API response e.g. Yes, No?


    // update to backend db
    createNewTweet({
      variables: { userId: currentUser.id, body },
      refetchQueries: [GET_TIMELINE_TWEETS, GET_CURRENT_USER],
    }).then(() => {
      textarea.value = '';
    }).catch((err: unknown) => {
      console.error('Problem creating new data record', err);
    });
  };

  // Task 3: format the form here to make it presentable

  return (
    <div className="new-tweet">
      <form onSubmit={handleSubmit}>
        Congratulations your phone will arrive ready to use with a new number. 
        <br></br>       
        In the meantime, we'll get started on transferring your number over so you can use it with your new phone.
        <br></br>
        <br></br>

        <label>
          Phone number:
          <input name="phoneNumber" id="phoneNumber" placeholder="Enter phone number"></input>
        </label>
        <br></br>
        <br></br>

        <label>
          Billing address:
          <input name="billingAddress" placeholder="Billing Address"></input>
        </label>
        <br></br>
        <br></br>

        <label>
        Password:
          <input name="password" placeholder="Password or PIN"></input>
          Note: This is NOT the password you use to login to their website. If you are unsure if you have this, please contact your carrier
        </label>
        <br></br>
        <br></br>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
export default ComposePanel;
