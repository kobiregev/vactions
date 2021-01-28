import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import jwt_decode from "jwt-decode";
import Alert from '../Alert/Alert'
import Side from './Side';



export default function Login({ history }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const user = useSelector(state => state.LoginReducer)
    const dispatch = useDispatch()
    const handleSubmit = async () => {
        try {
            let res = await fetch('http://localhost:1000/users/login', {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            let data = await res.json()
            if (data.error) {
                setErrorMsg(data.msg)
            } else {
                let { id, role, fname } = jwt_decode(data.acess_token)
                dispatch({ type: "LOGIN", payload: { id, role, fname, token: data.acess_token } })
                history.push("/")
            }
        } catch (error) {

        }

    }

    return (

        <div className="login_div">
            <div className="login_container">
                <Side />
                <Paper className="login_paper" >
                    <Typography variant="overline">Enter your login details below.</Typography>
                    {errorMsg && <Alert message={errorMsg} />}
                    <form className="login" >
                        <TextField label="Username" onChange={(e) => setUsername(e.target.value)} />
                        <TextField label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                        <Button variant="contained" color="primary" onClick={() => handleSubmit()}>Login</Button>
                        <p>Don't have an account yet? <Link to="/register">Register</Link></p>
                    </form>
                </Paper>
            </div>
        </div>
    )
}
