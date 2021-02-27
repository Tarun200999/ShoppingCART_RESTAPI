# ShoppingCART_RESTAPI
RESTAPI  (signin,signup,createproduct,showproducts,createcart,showcart,updatecart)

Route 1 -> 

https://shoppingcart035.herokuapp.com/signup

{ "name":"user",
  "email":"user@user.com",
  "password":"12345"
}
Send this in Body You will get registered Succesfully

Route-> 2

https://shoppingcart035.herokuapp.com/signin

{ 
  "email":"user@user.com",
  "password":"12345"
}

Send this in Body you will get a JWT Token as a response

Now for other Routes Use The above JWT token to validate the request


Route 3 ->

https://shoppingcart035.herokuapp.com/createproduct

{
      name: name,
      price: price,
      quantity: quantity,
      description: description,
      image: req.file.path,
      productBY: req.user,
}

Send this with Form data and the JWT token Your Product will be added to database


Rouet 4->

https://shoppingcart035.herokuapp.com/showproducts

This will return a json of all the products 

Rouet 5 ->

https://shoppingcart035.herokuapp.com/addtocart

{
  productID:"asdsfd",
  quantity:2
  }
  send this in body with JWT token your product will be added to cart
Route 6->

https://shoppingcart035.herokuapp.com/showcart

this will give json of your cart ( logged in user cart ) you have to send JWT token





  

