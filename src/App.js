import { useEffect, useState } from 'react';
import data from "./database.json";

function App() {
  const [text, setText] = useState("");
  const [listProducts, setListProducts] = useState([]);
  const [searchListProducts, setSearchListProducts] = useState([]);
  const [cart, setCart] = useState({});
  const managementList = listProducts.filter(product => product.variants[0].inventory_management === null);
  const policyList = listProducts.filter(product => product.variants[0].inventory_policy === "deny");

  useEffect(() => {
      const { products } = data;
      setListProducts(products);
      setSearchListProducts(products);
  }, [])

  function search() {
    const newListProducts = listProducts.filter(product => product.title.toUpperCase().includes(text.toUpperCase()));
    setSearchListProducts(newListProducts);
  }

  function addToCart(name) {
    const product = listProducts.find(product => product.title === name);
    const isHaveProduct = Object.keys(cart).includes(name);
    const management = managementList.includes(product);
    const policy = policyList.includes(product);
    
    // if not allow to order when the stock is out of stock and the number of goods < 0, or the number of goods in the basket is greater than the number of goods in stock
    if (policy && (product.variants[0].inventory_quantity < 0 || cart[name] >= product.variants[0].inventory_quantity)) {
      alert("Sold Out");
      return;
    }
    // if allow to order when the stock is out of stock and not allowed to buy regardless of quantity or the number of items in the basket is more than 10
    if (!policy && !management && cart[name] >= 10) {
      alert("This item can only be purchased 10 pieces");
      return;
    }
    // if cart not have name of the key === name parameters
    if (!isHaveProduct) {
      setCart(prevState => ({
        ...prevState,
        [name]: 1
      }))
      return;
    }
    // if cart have name of the key === name parameters
    setCart(prevState => ({
      ...prevState,
      [name]: prevState[name] + 1
    }))
  }

  console.log(cart);

  return (
    <div className="App">
      <div className="search">
        <input type="text" placeholder="Search Products" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={search}>Search</button>
        <div className="cart-button">
          <button>Cart</button>
          <ul className="cart-dropdown-content">
            {Object.keys(cart).length > 0 ? Object.keys(cart).map(product => (
                <li key={product} className="cart-product">{product}: {cart[product]}</li>
              )) : (
                <li className="cart-product">There are no items available</li>
              )
            }
          </ul>
        </div>
      </div>
      <div className="product-container">
        {searchListProducts.length > 0 ? searchListProducts.map(product => (
          <div key={product.id} className="product">
            <img src={product.image.src} alt={product.image.src} className="product-img" />
            <h4 className="product-title">{product.title}</h4>
            <div>
              <span className="product-price">${product.variants[0].price}</span>
              <span className="product-cost-price">${product.variants[0].compare_at_price}</span>
            </div>
            <div className="product-discount">Discount: { parseFloat(product.variants[0].compare_at_price) > 0 ? 100 - Math.ceil((parseFloat(product.variants[0].price) / parseFloat(product.variants[0].compare_at_price) * 100)) : 100 } %</div>
            <div className="product-quantity">Quantity: {product.variants[0].inventory_quantity > 0 ? product.variants[0].inventory_quantity : "Sold Out"}</div>
            <div className="add-to-cart" onClick={() => addToCart(product.title)}>ADD TO CART</div>
          </div>
        )) :
          <div>No Data</div>
        }
      </div>
    </div>
  );
}

export default App;

