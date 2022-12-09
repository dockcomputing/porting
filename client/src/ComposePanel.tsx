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


const inputStyles = {
  outline: 'none',
  borderRadius: '5px',
  height: '30px',
  lineHeight: '30px',
  border: '1px solid #8080804d',
  marginTop: '5px',
  padding: '5px',
}

const labelStyles = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1a1f36',
}

const PHONE_LEN = 14;

const ComposePanel: React.FC<ComposePanelProps> = ({ currentUser }) => {
  const [createNewRecord, { error }] =
    useCreateNewTweetMutation();
  if (error) return <p>Error creating new data record: {error}</p>

  const [state, setState] = React.useState({
    phoneNumber: "",
    billingAddress: "",
    password: "",
  })

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isPortingElement = document.getElementById('is-porting')!cd 
    isPortingElement.innerHTML = ''
  }

  const handlePhoneInput = (e: any) => {
    var x = e?.target?.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    setState(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // handle multiple input from form
    const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement)
    
    if (phoneNumber.value.length < PHONE_LEN) {
      console.log('return')
      return
    } else {
      console.log('Value for phone number is: ', phoneNumber.value)
    }

    const body = phoneNumber.value.replace(/[\s\(\)\-]/g, "");
    console.log(body)
    const billingElement = (document.getElementById('billingAddress') as HTMLInputElement)
    console.log('Value for billing is: ', billingElement.value)

    const passwordElement = (document.getElementById('password') as HTMLInputElement)
    console.log('Value for password is: ', passwordElement.value)

    // call any API here and get back a API response e.g. Yes, No?
    // Checking if it's sunny via OpenMeteoAPI
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=36.778259&longitude=-119.417931&current_weather=True`)
      .then((res) =>
        res.json().then(
          (data) => {
            const isPortingElement = document.getElementById('is-porting')!
            if (data.current_weather.weathercode !== 0) {
              isPortingElement.innerHTML = 'Porting request submitted'
            } else {
              isPortingElement.innerHTML = 'Issues encountered in porting. Need to contact customer service.'
            }
          }
        ))

    // update to backend db
    createNewRecord({
      variables: { userId: currentUser.id, body },
      refetchQueries: [GET_TIMELINE_TWEETS, GET_CURRENT_USER],
    }).then(() => {
      phoneNumber.value = '';
      passwordElement.value = '';
      billingElement.value = '';
    }).catch((err: unknown) => {
      console.error('Problem creating new data record', err);
    });
  };

  // format the form here to make it presentable
  return (
    <div className="new-tweet" style={{
      display: 'flex',
      marginTop: '20px',
      marginBottom: '20px',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px',
    }}>
      <form onSubmit={handleSubmit} onChange={handleChange} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        width: '60%',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        borderRadius: '5px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h3>Congratulations on your new phone!</h3>
          Your phone will arrive ready to use with a new number.
          <br /><br />
          In the meantime, we'll get started on transferring your number over so you can use it with your new phone.
        </div>

        <div className="form-item" style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          <label style={labelStyles}>
            Phone Number
          </label>
          <input name="phoneNumber" id="phoneNumber" placeholder="Enter the phone number here ..." style={inputStyles} onInput={handlePhoneInput} value={state.phoneNumber}></input>
        </div>

        <div className="form-item" style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          <label style={labelStyles}>
            Billing Address
          </label>
          <input type="text" name="billingAddress" id="billingAddress" placeholder="Enter the Billing Address here ..." style={inputStyles}></input>
        </div>

        <div className="form-item" style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          <label style={labelStyles}>
            Password
          </label>
          <input name="password" id="password" placeholder="Enter the Password or PIN here ..." style={inputStyles}></input>
          <div style={{
            marginTop: '20px',
            background: '#80808036',
            padding: '10px',
            borderRadius: '5px',
            alignItems: 'center',
            flexDirection: 'column',
            display: 'flex',
            gap: '5px'
          }}>
            <div><h4 style={{margin: '0px'}}>Note:</h4></div>
            <div style={{fontSize: '14px', textAlign: 'center'}}> This is NOT the password you use to login to their website. If you are unsure if you have this, please contact your carrier</div>
        </div>
      </div>

        <input type="submit" value="Submit" style={{
          borderRadius: '5px',
          color: 'white',
          width: '50%',
          height: '40px',
          backgroundColor: '#3b94d9',
          outline: 'none',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
        }} />
      </form>

      <div id="is-porting" style={{fontStyle: 'italic'}}></div>
    </div>
  );
};
export default ComposePanel;
