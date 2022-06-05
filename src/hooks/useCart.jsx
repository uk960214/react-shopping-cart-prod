import {
  addToCartThunk,
  deleteCartProductThunk,
  getCartThunk,
  toggleProductCheckThunk,
  updateCartProductQuantityThunk,
  updateCheckedList,
} from 'store/actions/cart.action';
import { cartStoreSelector } from 'store/selector';

import useReduxState from 'hooks/useReduxState';

import { WARNING_MESSAGES } from 'constants/messages';

const useCart = () => {
  const [cartState, dispatch] = useReduxState(cartStoreSelector);
  const { cart, checkedProductList } = cartState;

  const cartLength = cart && Object.keys(cart).length;

  const loadCart = () => {
    dispatch(getCartThunk());
  };

  const addProduct = ({ id, count }) => {
    dispatch(addToCartThunk(id, count));
  };

  const dispatchQuantityUpdate = (productId, quantity) => {
    dispatch(updateCartProductQuantityThunk(productId, quantity));
  };

  const incrementCartProduct = (productId, currentQuantity) => {
    dispatchQuantityUpdate(productId, currentQuantity + 1);
  };

  const decrementCartProduct = (productId, currentQuantity) => {
    if (currentQuantity === 1) {
      alert(WARNING_MESSAGES.MIN_QUANTITY);
      return;
    }
    dispatchQuantityUpdate(productId, currentQuantity - 1);
  };

  const deleteProduct = (productIdArray) => {
    if (window.confirm(WARNING_MESSAGES.PRODUCTS_DELETE(1))) {
      dispatch(deleteCartProductThunk(productIdArray));
    }
  };

  const isChecked = (productId) => checkedProductList.includes(productId);

  const toggleCheck = (productId) => {
    dispatch(toggleProductCheckThunk(productId));
  };

  const isAllChecked = cartLength === checkedProductList.length;

  const toggleAllCheck = () => {
    if (isAllChecked) {
      dispatch(updateCheckedList([]));
      return;
    }

    dispatch(updateCheckedList(cart.map(({ productData }) => productData.id)));
  };

  const deleteCheckedProducts = () => {
    const checkedListLength = checkedProductList.length;

    if (
      checkedListLength !== 0 &&
      window.confirm(WARNING_MESSAGES.PRODUCTS_DELETE(checkedListLength))
    ) {
      dispatch(deleteCartProductThunk(checkedProductList));
    }
  };

  const checkedProductsTotalPrice = checkedProductList.reduce((total, productId) => {
    const { productData, quantity } = cart.find(
      ({ productData }) => productData.id === productId,
    );
    return total + productData.price * Math.min(quantity, productData.stock);
  }, 0);

  return {
    cart,
    cartLength,
    loadCart,
    addProduct,
    decrementCartProduct,
    incrementCartProduct,
    deleteProduct,
    isChecked,
    toggleCheck,
    checkedProductCount: checkedProductList.length,
    isAllChecked,
    toggleAllCheck,
    deleteCheckedProducts,
    totalPrice: checkedProductsTotalPrice,
  };
};

export default useCart;
