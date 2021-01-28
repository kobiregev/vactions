import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import Alert from '../Alert/Alert'
import { useSelector } from 'react-redux';


export default function Register() {
    const [user_fname, setUser_fname] = useState('')
    const [user_lname, setUser_lname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const user = useSelector(state => state.LoginReducer)

    const history = useHistory()
    
    const handleSubmit = async () => {
        let res = await fetch('http://localhost:1000/users/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_fname, user_lname, username, password })
        })
        let data = await res.json()
        if (res.status === 200) {
            history.push('/')
        } else if (data.error) {
            setErrorMsg(data.msg)
        }
    }
    return (
        <>{user.login ? history.push('/') :
            <div className="register_container">
                <Typography variant="h2">Register</Typography>
                <Paper >
                    <form className="register" >
                        {errorMsg && <Alert message={errorMsg} />}
                        <TextField onChange={e => { setUser_fname(e.target.value) }} label="First Name" />
                        <TextField onChange={e => { setUser_lname(e.target.value) }} label="Last Name" />
                        <TextField onChange={e => { setUsername(e.target.value) }} label="Username" />
                        <TextField onChange={e => { setPassword(e.target.value) }} label="Password" type="password" />
                        <Button variant="contained" color="primary" onClick={() => handleSubmit()}>Register</Button>
                        <p>Already Registed? Please <Link to="/Login">Login</Link></p>
                    </form>
                </Paper>
            </div>}
        </>
    )
}
