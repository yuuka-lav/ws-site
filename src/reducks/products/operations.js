import { push } from 'connected-react-router';
import { db, FirebaseTimestamp } from '../../firebase/index';
import { fetchProductsAction, deleteProductsAction, getProductsAction } from './actions';

const productsRef = db.collection('products')

export const getProduct = (searchWord) => {
  return async (dispatch) => {
    const searchedData = productsRef.orderBy("name").startAt(searchWord).endAt(searchWord + '\uf8ff');
    const snapshot = await searchedData.get();
    const tenporaryData = [];

    snapshot.docs.map(doc => {
      tenporaryData.push(doc.data());
    })
    dispatch(getProductsAction(tenporaryData))
  }
}

export const fetchProducts = (type, style) => {
  return async (dispatch) => {
    let query = productsRef.orderBy('updated_at', 'desc')
    query = (type !== "") ? query.where('type', '==', type) : query;
    query = (style !== "") ? query.where('style', '==', style) : query;

      query.get()
        .then(snapshots => {
          const productList = []
          snapshots.forEach(snapshot => {
            const product = snapshot.data()
            productList.push(product)
          })
          dispatch(fetchProductsAction(productList))
        })
  }
}

export const saveProduct = (id, images, name, description, address, url, type, style, number, price, area) => {
  return async (dispatch) => {
      const timestamp = FirebaseTimestamp.now();

      const data = {
        images: images,
        name: name,
        description: description,
        address: address,
        url: url,
        type: type,
        style: style,
        number: number,
        price: price,
        area: area,
        updated_at: timestamp
      }

      if (id === "") {
          const ref = productsRef.doc()
          data.created_at = timestamp;
          id = ref.id;
          data.id = id;
      }

      return productsRef.doc(id).set(data, {merge: true})
          .then(() => {
              dispatch(push('/product'))
          }).catch((error) => {
              throw new Error(error)
          })
  }
}

export const saveCost = ( 
  id,
  dress1, dress2, dress3, dress4, 
  snap1, snap2, snap3, 
  movie1, movie2, movie3,
  bouquet1 ,bouquet2, bouquet3, bouquet4,
  makeAndDressing1, makeAndDressing2, makeAndDressing3, makeAndDressing4,
  dish1, dish2, dish3, dish4,
  cake1, cake2, cake3, cake4,
  flowerDecoration1, flowerDecoration2, flowerDecoration3, flowerDecoration4,
  staging1, staging2, staging3,
  gift1, gift2, gift3,
  value1, value2,
  productId,
  weddingFee,
  tax,
  venueUsageFee
  ) => {
  return async (dispatch) => {
      const timestamp = FirebaseTimestamp.now();

      const data = {
        dress1: "dress" + dress1,
        dress2: "dress" + dress2,
        dress3: "dress" + dress3,
        dress4: "dress" + dress4,
        snap1: "snap" + snap1,
        snap2: "snap" + snap2,
        snap3: "snap" + snap3,
        movie1: "movie" + movie1,
        movie2: "movie" + movie2,
        movie3: "movie" + movie3,
        bouquet1: "bouquet" + bouquet1,
        bouquet2: "bouquet" + bouquet2,
        bouquet3: "bouquet" + bouquet3,
        bouquet4: "bouquet" + bouquet4,
        makeAndDressing1: "makeAndDressing" + makeAndDressing1,
        makeAndDressing2: "makeAndDressing" + makeAndDressing2,
        makeAndDressing3: "makeAndDressing" + makeAndDressing3,
        makeAndDressing4: "makeAndDressing" + makeAndDressing4,
        dish1: "dish" + dish1,
        dish2: "dish" + dish2,
        dish3: "dish" + dish3,
        dish4: "dish" + dish4,
        cake1: "cake" + cake1,
        cake2: "cake" + cake2,
        cake3: "cake" + cake3,
        cake4: "cake" + cake4,
        flowerDecoration1: "flowerDecoration" + flowerDecoration1,
        flowerDecoration2: "flowerDecoration" + flowerDecoration2,
        flowerDecoration3: "flowerDecoration" + flowerDecoration3,
        flowerDecoration4: "flowerDecoration" + flowerDecoration4,
        staging1: "staging" + staging1,
        staging2: "staging" + staging2,
        staging3: "staging" + staging3,
        gift1: "gift" + gift1,
        gift2: "gift" + gift2,
        gift3: "gift" + gift3,
        value1: "value" + value1, 
        value2: "value" + value2,
        weddingFee: weddingFee,
        tax: tax,
        venueUsageFee: venueUsageFee,
        updated_at: timestamp
      }


    const ref = productsRef.doc(productId).collection('cost').doc()
    data.created_at = timestamp;
    id = ref.id;
    data.id = id

    const costId = {
      costId: id
    }

    productsRef.doc(productId).set(costId, {merge: true})
      const cost = productsRef.doc(productId).get()
      if (cost.costId !== "") {
        productsRef.doc(productId).update({
          costId: id
        })
      }


      const costRef = db.collection('products').doc(productId).collection('cost').doc(id)
      await costRef.set(data, {merge: true})
      .then(() => {
          dispatch(push('/'))
      }).catch((error) => {
          throw new Error(error)
      })
  }
}


export const deleteProducts = (id) => {
  return async (dispatch, getState) => {
    productsRef.doc(id).delete()
      .then(() => {
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(product => product.id !== id)
        dispatch(deleteProductsAction(nextProducts))
      })
  }
}

export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection('users').doc(uid);
    const timestamp = FirebaseTimestamp.now();
    
    let products = [],
        soldOutProducts = [];
    const batch = db.batch();

    for (const product of productsInCart) {
      const snapshot = await productsRef.doc(product.productId).get();
      const sizes = snapshot.data().sizes;

      const updatedSizes = sizes.map(size => {
        if (size.size === product.size) {
          if (size.quantity === 0) {
            soldOutProducts.push(product.name)
            return size
          }
          return {
            size: size.size,
            quantity: size.quantity - 1
          }
        } else {
          return size
        }
      }) 
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      });

      batch.update(
        productsRef.doc(product.productId),
        {sizes: updatedSizes}
      )
      batch.delete(
        userRef.collection('cart').doc(product.cartId)
      )
    }
    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) ?
                            soldOutProducts.join('と') :
                            soldOutProducts[0];
      alert(errorMessage + 'が在庫切れのため購入をやり直してください')
      return false
    } else {
      batch.commit()
        .then(() => {
          const orderRef = userRef.collection('orders').doc();
          const date = timestamp.toDate()
          const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)))

          const history = {
            amount: amount,
            created_at: timestamp,
            updated_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate
          }

          orderRef.set(history);
          dispatch(push('/order/complete'))
        }).catch(() => {
          alert('注文処理に失敗しました。通信環境をお確かめのうえ、もう一度お試しください')
          return false
        })
    }
  }
}
