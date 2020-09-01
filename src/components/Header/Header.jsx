import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {useDispatch, useSelector} from "react-redux";
import { getIsSinedIn } from "../../reducks/users/selectors";
import logo from "../../assets/img/icons/wedding-logo.png";
import {push} from "connected-react-router"
import {HeaderMenu, MenuDrawer, BeforeHeaderMenu} from "./index"

const useStyles = makeStyles({
  root: {
    flexGrow:1,
  },
  memuBar: {
    backgroundColor: "rgba(255, 255, 255, 0.815)",
    color: '#444',
  },
  toolBar: {
    margin: '0 auto',
    maxWidth: 1360,
    width: '100%'
  },
  iconButtons: {
    margin: '0 0 0 auto'
  }
})

const Header = () => {
  const classes = useStyles()
  const selector = useSelector((state) => state)
  const isSignedIn = getIsSinedIn(selector)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false);

  const handleDrawerToggle = useCallback((event)=>{
    if (event.type === 'keydown' || event.key === 'Tab' || event.key === 'Shift') {
        return
      }
    setOpen(!open)
  },[setOpen, open])

  return(
    <>
    {isSignedIn ? (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.memuBar}>
          <Toolbar className={classes.toolBar}>
            <img 
              src={logo} alt="yuuka logo" width="160px"
              onClick={() => dispatch(push('/'))}
            />
            
              <div className={classes.iconButtons}>
                <HeaderMenu handleDrawerToggle={handleDrawerToggle}/>
              </div>
          </Toolbar>
        </AppBar>
        <MenuDrawer open={open} onClose={handleDrawerToggle}/>
      </div>
    ) : (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.memuBar}>
          <Toolbar className={classes.toolBar}>
            <img 
              src={logo} alt="yuuka logo" width="160px"
              onClick={() => dispatch(push('/'))}
            />
              <div className={classes.iconButtons}>
                <BeforeHeaderMenu handleDrawerToggle={handleDrawerToggle}/>
              </div>
          </Toolbar>
        </AppBar>
      </div>
    )}
    </>
  )
}


export default Header;