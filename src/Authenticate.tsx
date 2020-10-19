import React, { ChangeEvent } from 'react'
import { Container } from 'reactstrap' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'

interface Props {
    authUser: any,
    emailHandler: any,
    passHandler: any,
    setAuthenticate: any,
    email: string,
    password: string,
    showError: boolean
}

const Authenticate:React.FC<Props> = ({authUser,
    emailHandler, passHandler, setAuthenticate, email, password, showError}) => {
   
    const updateEmailInput = (e:ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      emailHandler(e.currentTarget.value)
    }
  
    const updatePassInput = (e:ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      passHandler(e.currentTarget.value)
    }
  
    const onSubmit = (e:ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      authUser(email, password) 
    }
  
    return (
        <Container>
        <h1 style={{fontWeight: 'lighter', textAlign: 'center', marginBottom: '30px', color: 'white', paddingTop: 50}}>Login</h1>
        <form onSubmit={onSubmit} style={{textAlign: 'center'}}>
            <div style={{marginBottom: '30px'}}><input className='loginInput' name='emailInput' type='email' placeholder='Email address' onChange={updateEmailInput}></input></div>
            <div><input className='loginInput' name='passwordInput' type='password' placeholder='Password' onChange={updatePassInput}></input></div>
            {showError ? <p style={{color: 'white', paddingTop: '20px'}}>Incorrect details!</p> : null}
            <button className='coolButton' type='button' style={{marginTop:'30px'}} onClick={() => setAuthenticate(false)}><FontAwesomeIcon icon={faCaretLeft}/></button>
            <button className='coolButton' type='submit' style={{marginTop:'30px'}}>Log In</button>
        </form>
        </Container>
    )
}

export default Authenticate;