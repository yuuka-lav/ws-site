import React, {useState, useCallback} from 'react';
import { TextInput, PrimaryButton } from '../components/UIkit';
import { adminSignUp } from '../reducks/users/operations';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import HttpsIcon from '@material-ui/icons/Https';
import { Divider } from '@material-ui/core';

const AdminSignUp = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState(""),
        [isUsername, setIsUsername] = useState(false),
        [email, setEmail] = useState(""),
        [isEmail, setIsEmail] = useState(false),
        [password, setPassword] = useState(""),
        [isPassword, setIsPassword] = useState(false),
        [confirmPassword, setConfirmPassword] = useState(""),
        [isConfirmPassword, setIsConfirmPassword] = useState(false);

  const errorMessage = (username, email, password, confirmPassword) => {
    // textInput
    if (username === "") {
      setIsUsername(true)}
    else{
      setIsUsername(false)}

    if (email === "") {
      setIsEmail(true)}
    else{
      setIsEmail(false)}
  
    if (password === "") {
      setIsPassword(true)}
    else{
      setIsPassword(false)}
  
    if (confirmPassword === "") {
      setIsConfirmPassword(true)}
    else{
      setIsConfirmPassword(false)}
  
    if (username !== "" && email !== "" && password !== "" && confirmPassword !== "") {
      dispatch(adminSignUp(username, email, password, confirmPassword))
    }
  }


  const inputUsername = useCallback((event) => {
    setUsername(event.target.value)
  }, [setUsername])

  const inputEmail = useCallback((event) => {
    setEmail(event.target.value)
  }, [setEmail])

  const inputPassword = useCallback((event) => {
    setPassword(event.target.value)
  }, [setPassword])

  const inputConfirmPassword = useCallback((event) => {
    setConfirmPassword(event.target.value)
  }, [setConfirmPassword])

  
  return(
    <div className="back-ground-main">
      <div className="c-section-main">
        <h2 className="u-text__headline u-text-center">Create Account</h2>
        <Divider/>
        <div className="module-spacer--medium" />
  
      <Grid container spacing={1} alignItems="flex-end" >
        <Grid item>
          <AccountCircle />
        </Grid>
        <Grid item >
          <TextInput 
            id="input-with-icon-grid" 
            fullWidth={ true }
            label={ "会社名" }
            multiline={ false }
            rows={ 1 }
            value={ username }
            type={ "text" }
            required={ true }
            onChange={ inputUsername }
          />
        </Grid>
      </Grid>
      { isUsername && <span className="error-message">ユーザー名を入力してください</span> }

      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <EmailIcon />
        </Grid>
        <Grid item>
          <TextInput 
            fullWidth={ true }
            label={ "メールアドレス" }
            multiline={ false }
            rows={ 1 }
            value={ email }
            type={ "email" }
            required={ true }
            onChange={ inputEmail }
          />
        </Grid>
      </Grid>
      { isEmail && <span className="error-message">メールアドレスを入力してください</span> }

      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <HttpsIcon />
        </Grid>
        <Grid item>
          <TextInput 
            fullWidth={ true }
            label={ "パスワード(6文字以上)" }
            multiline={ false }
            rows={ 1 }
            value={ password }
            type={ "password" }
            required={ true }
            onChange={ inputPassword }
          />
        </Grid>
      </Grid>
      { isPassword && <span className="error-message">パスワードを入力してください</span> }

      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <HttpsIcon />
        </Grid>
        <Grid item>
          <TextInput 
            fullWidth={ true }
            label={ "パスワード(再確認)" }
            multiline={ false }
            rows={ 1 }
            value={ confirmPassword }
            type={ "password" }
            required={ true }
            onChange={ inputConfirmPassword }
          />
        </Grid>
      </Grid>
      { isConfirmPassword && <span className="error-message">パスワード(再確認)を入力してください</span> }

        <div className="center">
          <PrimaryButton label={ "Sign up" } onClick={() => errorMessage(username, email, password, confirmPassword)}/>
          <div className="module-spacer--medium" />
          <div  className="c-cursor"
              onClick={() => dispatch(push("/signin"))}>アカウントをすでにお持ちの方はこちら</div>
          </div>
      </div>
      </div>
  )  
}

export default AdminSignUp;