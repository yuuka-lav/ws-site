import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from '@material-ui/icons/Person';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

const HeaderMenu = (props) => {
  const dispatch = useDispatch()

  return(
    <>
      <IconButton onClick={() => dispatch(push('/favorite'))}>
        <FavoriteBorderIcon/>
      </IconButton>

      <IconButton onClick={() => dispatch(push('/user/mypage')) }>
        <PersonIcon />
      </IconButton>

      <IconButton onClick={(event)=> props.handleDrawerToggle(event)}>
        <MenuIcon/>
      </IconButton>
    </>
  )
}

export default HeaderMenu