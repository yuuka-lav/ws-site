import React, { useCallback } from 'react';
import List from '@material-ui/core/List';
import { useDispatch, useSelector } from 'react-redux';
import { EntryListItem } from '../components/Products';
import { GrayButton } from '../components/UIkit';
import { push } from 'connected-react-router';
import { makeStyles } from '@material-ui/core';
import { useEffect } from 'react';
import { db } from '../firebase';
import { getUserId } from '../reducks/users/selectors';
import { useState } from 'react';

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
    maxWidth: 512,
    width: '100%'
  }
})

const ProductEntry = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state);
  const uid = getUserId(selector)

  const [data, setData] = useState("");

  const backToHome = useCallback(() => {
    dispatch(push('/product'))
  },[])

  useEffect(() => {
    db.collection("users").doc(uid).collection("products").get().then(function(querySnapshot) {
      const data = querySnapshot.docs.map(function(doc) {
        return doc.data()
      })
      setData(data)
    })
  },[])


  return(
    <section className="c-section-wrapin">
      <div className="main">
        <h2 className="u-text__headline">
          登録した式場
        </h2>
        {
          data.length === 0 ? (
            <h1>登録した式場はありません</h1>
          ):(
            <List className={classes.root}>
              {
                (data === null) ? (
                  <></>
                ):(
                  data.length > 0 && (
                    data.map(product => <EntryListItem key={ product.id } product={ product }/>)
                  )
                )
              }
            </List>
          )
        }
        <div className="module-spacer--medium" />
        <div className="p-grid__column">
          <GrayButton
            label={"他の式場も見てみる"}
            onClick={ backToHome }
          />
        </div>
      </div>
    </section>
  )
}

export default ProductEntry;