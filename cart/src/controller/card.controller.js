
const CardModel= require('../model/card.model.js')


const getCard= async (req,res)=>{

    const user = req.user
    let card = await CardModel.findOne({user:user._id})
    if(!card){
        card = new CardModel({user:user._id,iteams:[]})
        await card.save()
    }
    res.status(200).json({
        message:'User card',
        card
    })

}

const addItemToCard= async (req,res)=>{

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
        card.iteams.push({productId,quantity})
    } 
 
    await card.save()
    res.status(200).json({message:'Item added to card',card})
}

const updateItemQuantity = async (req, res) => {

    const { productId } = req.params;
    const { qty } = req.body;
      const user = req.user;
        const cart = await CardModel.findOne({ user: user._id });
          if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const existingItemIndex = cart.iteams.findIndex(iteams=>iteams.productId.toString() === productId); // if noe then show -1 
    if (existingItemIndex < 0 ) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    cart.iteams[existingItemIndex].quantity = qty;
    await cart.save();
    res.status(200).json({ message: 'Item quantity updated', cart });
}


module.exports={addItemToCard,getCard,updateItemQuantity }


