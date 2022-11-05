import {
  VIRTUAL_PAGE_VIEW,
  TRACK_VIEW_ITEM_LIST,
  TRACK_SELECT_ITEM,
  TRACK_VIEW_ITEM,
  TRACK_ADD_TO_CART,
  TRACK_REMOVE_FROM_CART,
  TRACK_VIEW_CART,
  TRACK_BEGIN_CHECKOUT,
  TRACK_ADD_SHIPPING_INFO,
  TRACK_ADD_PAYMENT_INFO,
  TRACK_PURCHASE,
  TRACK_VIEW_PROMOTION,
  TRACK_SELECT_PROMOTION,
  TRACK_NAVIGATION_CLICK,
  TRACK_LOGIN,
} from './actionTypes';

// Create all Analytics actions to be handled by the middleware, skips reducers

/**
 * Send the virtualPageView, page data
 */
export const virtualPageView = (pageProps) => {
  return {
    type: VIRTUAL_PAGE_VIEW,
    payload: {
      ...pageProps,
    },
  }
}

/**
 * Send the view item list, product data
 */
export const viewItemList = (products, list) => {
  const ecomObj =  {
    list_id: list.id,
    category: list.name,
    products: [],
  };
  ecomObj.products = products.map((
    {
      name,
      id,
      price,
      categories,
      variant_groups,
    },
    index
  ) => {
    const prod =  {
      product_id: id,
      sku: id,
      name: name,
      position: index,
      brand: "Blast",
      price: parseFloat(price.formatted),
      variant: `${variant_groups[0]?.name}: ${variant_groups[0]?.options[0]?.name}`,
    };
    categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_VIEW_ITEM_LIST,
    payload: {
      event: "Product List Viewed",
      properties: ecomObj,
    },
  }
}

/** 
 * A thunk for product impressions so that firing the action returns a promise.
 * We use this to sequence a state update in the collections component.
 */
export const trackViewItemList = (products, list) => (dispatch) => {
  dispatch(viewItemList(products, list));
  return Promise.resolve();
};


/**
 * Send the select item, product data
 */
export const trackSelectItem = (products, position, list) => {
  const ecomObj =  {
    products: []
  };
  ecomObj.products = products.map((
    {
      name,
      id,
      price,
      categories,
      variant_groups,
    }
  ) => {
    const prod =  {
      product_id: id,
      sku: id,
      name: name,
      position,
      brand: "Blast",
      price: parseFloat(price.formatted),
      variant: `${variant_groups[0]?.name}: ${variant_groups[0]?.options[0]?.name}`,
      list_id: list.id,
      list_name: list.name,
    };
    categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_SELECT_ITEM,
    payload: {
      event: "Product Clicked",
      properties: ecomObj.products[0],
    },
  }
}

/**
 * Send the view item, product data
 */
export const trackViewItem = (product) => {
  const { name, id, price, categories, variant_groups } = product;
  const prod = {
    product_id: id,
    sku: id,
    name: name,
    brand: "Blast",
    price: parseFloat(price.formatted),
    variant: `${variant_groups[0]?.name}: ${variant_groups[0]?.options[0]?.name}`,
  };
  categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
  return {
    type: TRACK_VIEW_ITEM,
    payload: {
      event: "Product Viewed",
      properties: prod,
    },
  }
}

/**
 * Send the addToCart, product data
 */
export const trackAddToCart = (product, quantity, selected_options) => {
  const { name, id, price, categories, variant_groups } = product;
  const createVariantFromGroups = (selectedOption) => {
    const variantId = Object.keys(selectedOption)[0];
    const variant_option_id = selectedOption[Object.keys(selectedOption)[0]];
    const variant = variant_groups.find(variant => variant.id === variantId);
    const variant_name = variant?.name;
    const variant_option = variant?.options.find(option => option.id === variant_option_id);
    const variant_option_name = variant_option?.name;
    return `${variant_name}: ${variant_option_name}`
  }
  let variant = '';
  if(selected_options[0]?.group_name) {
    variant = selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join();
  } else {
    variant = createVariantFromGroups(selected_options);
  }
  const prod = {
    product_id: id,
    sku: id,
    name: name,
    brand: "Blast",
    price: parseFloat(price.formatted),
    variant: variant,
    quantity
  };
  categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
  return {
    type: TRACK_ADD_TO_CART,
    payload: {
      event: "Product Added",
      properties: prod,
    },
  }
}

/**
 * Send the removeFromCart, product data
 */
export const trackRemoveFromCart = (product, quantity, selected_options) => {
  const { name, id, price, categories } = product;
  const prod = {
    product_id: id,
    sku: id,
    name: name,
    brand: "Blast",
    price: parseFloat(price.formatted),
    variant: selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join(),
    quantity
  };
  categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
  return {
    type: TRACK_REMOVE_FROM_CART,
    payload: {
      event: "Product Removed",
      properties: prod,
    },
  }
}

/**
 * Send the view cart, product data
 */
export const trackViewCart = (products, cart_id) => {
  const ecomObj =  {
    cart_id,
    products: []
  };
  ecomObj.products = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      selected_options,
    }
  ) => {
    const prod =  {
      product_id: id,
      sku: id,
      name: name,
      brand: "Blast",
      price: parseFloat(price.formatted),
      variant: selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join(),
      quantity
    };
    categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_VIEW_CART,
    payload: {
      event: "Cart Viewed",
      properties: ecomObj,
    },
  }
}

/**
 * Send the begin checkout, product data
 */
export const trackBeginCheckout = (products, cart_id) => {
  const ecomObj =  {
    cart_id,
    currency: "USD",
    products: []
  };
  ecomObj.products = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      selected_options,
    }
  ) => {
    const prod =  {
      product_id: id,
      sku: id,
      name: name,
      brand: "Blast",
      price: parseFloat(price.formatted),
      variant: selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join(),
      quantity
    };
    categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_BEGIN_CHECKOUT,
    payload: {
      event: "Checkout Started",
      properties: ecomObj,
    },
  }
}

/**
 * Send the add shipping info, product data
 */
export const trackAddShippingInfo = (products, cart_id, shipping_tier) => {
  const { description, price } = shipping_tier;
  const ecomObj =  {
    shipping_method: `${description} - ${price.formatted_with_code}`,
    step: 1,
    checkout_id: cart_id,
  };
  return {
    type: TRACK_ADD_SHIPPING_INFO,
    payload: {
      event: "Checkout Step Completed",
      properties: ecomObj,
    },
  }
}

/**
 * Send the add payment info, product data
 */
export const trackAddPaymentInfo = (products, cart_id) => {
  const ecomObj =  {
    checkout_id: cart_id,
  };
  return {
    type: TRACK_ADD_PAYMENT_INFO,
    payload: {
      event: "Payment Info Entered",
      properties: ecomObj,
    },
  }
}

/**
 * Send the purchase, product data
 */
export const trackPurchase = (products, orderReceipt) => {
  console.log(orderReceipt)
  const ecomObj =  {
    currency: 'USD',
    total: parseFloat(orderReceipt.order_value.formatted),
    revenue: parseFloat(orderReceipt.order.subtotal.formatted),
    coupon: orderReceipt.order.discount.code,
    payment_method: orderReceipt.transactions.map(trans => {
      return trans.payment_source.brand
    }).sort().join(),
    shipping_method: `${orderReceipt.order.shipping.description} - ${orderReceipt.order.shipping.price.formatted}`,
    order_id: orderReceipt.id,
    affiliation: orderReceipt.merchant.business_name,
    tax: parseFloat(orderReceipt.tax.amount.formatted),
    shipping: parseFloat(orderReceipt.order.shipping.price.formatted),
    checkout_id: orderReceipt.cart_id,
    products: []
  };
  ecomObj.products = products.map((
    {
      name,
      id,
      price,
      quantity,
      categories,
      selected_options,
    }
  ) => {
    const prod =  {
      product_id: id,
      sku: id,
      name: name,
      brand: "Blast",
      price: parseFloat(price.formatted),
      variant: selected_options.map(({group_name, option_name}) => `${group_name}: ${option_name}`).sort().join(),
      quantity
    };
    categories.forEach((cat, i) => prod[i > 0 ? `category${i+1}` : 'category'] = cat.name);
    return prod;
  });
  return {
    type: TRACK_PURCHASE,
    payload: {
      event: "Order Completed",
      properties: ecomObj,
    },
  }
}

/**
 * Send the select promotion, promotion data
 */
export const trackSelectPromotion = (promotion_id, promotion_name, creative_name, creative_slot, location_id) => {
  const ecomObj =  {
    items: [{
      promotion_id,
      promotion_name,
      creative_name,
      creative_slot,
      location_id,
    }]
  };
  return {
    type: TRACK_SELECT_PROMOTION,
    payload: {
      event: "select_promotion",
      ecommerce: ecomObj,
    },
  }
}


/**
 * Send the navigation click, page data
 */
export const trackNavigationClick = (link_name) => {
  return {
    type: TRACK_NAVIGATION_CLICK,
    payload: {
      event: "Navigation Click",
      properties: {
        link_name
      }
    },
  }
}

/**
 * Send the login, page data
 */
export const trackLogin = () => {
  return {
    type: TRACK_LOGIN,
    payload: {
      event: "Login",
    },
  }
}
