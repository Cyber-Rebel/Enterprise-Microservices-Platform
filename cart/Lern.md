onst addItemToCard= async (req,res)=>{

    const {productId,quantity}=req.body 

    const user = req.user
    
    let card = await CardModel.findOne({user:user._id})
    if(!card){
        card = new CardModel({user:user._id,iteams:[]})
    }
    const itemIndex = card.iteams.findIndex(item => item.productId.toString() === productId); 

    if(itemIndex >= 0){
        card.iteams[itemIndex].quantity += quantity; 
    }else{
        card.iteams.push({productId,quantity}) // ekar explaoin karna mu gpt ki agrar -1 index huva to cart itam se push kardo to productId kaha se hogi 
    } 
 
    await card.save()
    res.status(200).json({message:'Ite
    m added to card',card})
}

const updateItemQuantity = async (req, res) => {

    const { productId } = req.params;
    const { qty } = req.body;
      const user = req.user;
        const cart = await CardModel.findOne({ user: user._id });
          if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const existingItemIndex = cart.iteams.findIndex(iteams=>iteams.productId.toString() === productId);
    if (existingItemIndex < 0 ) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    cart.iteams[existingItemIndex].quantity = qty;
    await cart.save();
    res.status(200).json({ message: 'Item quantity updated', cart });
}
You said:
sirt use explain karo 
You said:
matlab ye mongodb id nahi create karga
You said:
at the end id clinet ki nahi hoti fir 