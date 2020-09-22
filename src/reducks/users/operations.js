import { signInAction, signOutAction, fetchProductsInFavoriteAction } from './actions';
import { push } from 'connected-react-router';
import { auth, db, FirebaseTimestamp } from '../../firebase/index';


export const addProductToFavorite = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid
    const favoriteRef = db.collection('users').doc(uid).collection('favorite').doc()
    addedProduct['favoriteId'] = favoriteRef.id
      await favoriteRef.set(addedProduct)
    dispatch(push('/favorite'))
  }
}

export const fetchProductsInFavorite = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInFavoriteAction(products))
  }
}

export const listenAuthState = () => {
  return async (dispatch) => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid

          db.collection('users').doc(uid).get()
            .then(snapshot =>{
              const data = snapshot.data()

              dispatch(signInAction({
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username
              }))
            })
      } else {
        dispatch(push("/signin"))
      }
    })
  }
}

export const signIn = (email, password) => {
  return async (dispatch) => {
    if ( email === "" || password === "") {
      alert("必須項目が未入力です")
      return false
    }

    auth.signInWithEmailAndPassword(email, password)
      .then (result => {
        const user = result.user
        
        if (user) {
          const uid = user.uid

          db.collection('users').doc(uid).get()
            .then(snapshot =>{
              const data = snapshot.data()

              dispatch(signInAction({
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username
              }))

              dispatch(push('/'))
            })
        }
      })
  }
}

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です")
      return false
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致しません。もう一度お試しください。")
      return false
    }
    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user

        if (user) {
          const uid = user.uid
          const timestamp = FirebaseTimestamp.now()
          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username
          }

          db.collection('users').doc(uid).set(userInitialData)
          .then(()=> {
            dispatch(push('/'))
          })
        }
      })
    
  }
}

export const signOut = () => {
  return async (dispatch) => {
    auth.signOut()
      .then(()=>{
        dispatch(signOutAction());
        dispatch(push('/signin'))
      })
  }
}

export const resetPassword = (email) => {
  return async (dispatch) => {
    if (email === "" ) {
      alert("メールアドレスが未入力です")
      return false
    }else{
      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert("入力されたメールアドレスにメッセージを送信しました。")
          dispatch(push("/signin"))
        }).catch("パスワードのリセットに失敗しました。再度送り直してください。")
    }
  }
}

export const adminSignUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です")
      return false
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致しません。もう一度お試しください。")
      return false
    }

    if (password.length < 6) {
      alert('パスワードは6文字以上で入力してください。')
      return false
    }

    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user

        if (user) {
          const uid = user.uid
          const timestamp = FirebaseTimestamp.now()
          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "admin",
            uid: uid,
            updated_at: timestamp,
            username: username
          }

          db.collection('users').doc(uid).set(userInitialData)
          .then(()=> {
            dispatch(push('/'))
          })
        }
      })
    
  }
}

export const costResult = (value, dress, snap, movie, bouquet, makeAndDressing, dish, cake, flowerDecoration, staging, gift) => {
  return async (dispatch, getState) => {
    console.log(value, dress, snap, movie, bouquet, makeAndDressing, dish, cake, flowerDecoration, staging, gift);
    const uid = getState().users.uid
    const costsRef = db.collection('users').doc(uid).collection('costs').doc()
    const result = Number(value) + Number(dress) + Number(snap) + Number(movie) + Number(bouquet) + Number(makeAndDressing) + Number(dish) + Number(cake) + Number(flowerDecoration) + Number(staging) + Number(gift)
    console.log(result);
    const addResult = {
      result: result
    }
      await costsRef.set(addResult)
      dispatch(push('/result'))
  }
}