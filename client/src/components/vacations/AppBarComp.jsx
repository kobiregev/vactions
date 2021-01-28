import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';
import { Divider, Menu, MenuItem } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});
export default function AppBarComp() {
    const user = useSelector(state => state.LoginReducer)
    const dispatch = useDispatch()
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setisOpen] = useState(false);
    let history = useHistory();

    const toggleDrawer = () => {
        setisOpen(!isOpen);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch({ type: "LOGOUT" })
        history.push('/')
        setAnchorEl(null);
    };
    const push = (pushTo) => {
        if (pushTo === '/charts') {
            history.push(pushTo)
            toggleDrawer()
        } else if (pushTo === '/add') {
            history.push(pushTo)
            toggleDrawer()
        } else {
            history.push(pushTo)
            toggleDrawer()
        }
    }
    const location = useLocation();
    return (
        <div >
            {user.login && location.pathname !== '/login' &&
                <AppBar position="relative">
                    <Toolbar>
                        {user.role === 'admin' &&
                            <IconButton onClick={toggleDrawer}
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="open drawer"
                            >
                                <MenuIcon />
                            </IconButton>}
                        <div >
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleClick}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                           Hello {user.fname}
                        </div>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                    <Drawer open={isOpen} onClose={toggleDrawer} >
                        <List className={classes.list}>
                            <ListItem button onClick={() => { push('/') }}>
                                <ListItemIcon>
                                    <FlightTakeoffIcon />
                                </ListItemIcon>
                                <ListItemText primary="Vacations" />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => { push('/charts') }}>
                                <ListItemIcon>
                                    <EqualizerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Charts" />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => { push('/add') }}>
                                <ListItemIcon>
                                    <AddCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add Vacation" />
                            </ListItem>
                        </List>
                    </Drawer>
                </AppBar>}
        </div>
    )
}
