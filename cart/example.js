let data = [
  {
    "user": "652f9c2b8d1a5e4c3b2a9d11",
    "iteams": [
      { "productId": "652fa2347d1a9e6b4f3c7d21", "quantity": 2 },
      { "productId": "652fa2457d1a9e6b4f3c7d22", "quantity": 1 }
    ]
  },
  {
    "user": "652f9c2b8d1a5e4c3b2a9d12",
    "iteams": [
      { "productId": "652fa2567d1a9e6b4f3c7d23", "quantity": 3 }
    ]
  },
  {
    "user": "652f9c2b8d1a5e4c3b2a9d13",
    "iteams": [
      { "productId": "652fa2677d1a9e6b4f3c7d24", "quantity": 5 },
      { "productId": "652fa2787d1a9e6b4f3c7d25", "quantity": 2 },
      { "productId": "652fa2897d1a9e6b4f3c7d26", "quantity": 1 }
    ]
  },
  {
    "user": "652f9c2b8d1a5e4c3b2a9d14",
    "iteams": [
      { "productId": "652fa2907d1a9e6b4f3c7d27", "quantity": 4 },
      { "productId": "652fa2a17d1a9e6b4f3c7d28", "quantity": 1 }
    ]
  }
]


let findcartofuser = (userId ,productId) => {
  const user = data.find(u => u.user === userId);
  console.log(user)
  if (!user) return console.log("User not found");
  // userId to sting hae na to string opertion mat bhaii mere 

    const findProductidIndex = user.iteams?.findIndex(item => item.productId === productId)
    console.log(findProductidIndex)

   user.iteams[findProductidIndex].quantity +=2;

   console.log(user)


}

// findcartofuser('652f9c2b8d1a5e4c3b2a9d14' ,'652fa2907d1a9eb4f3c7d27')


let 