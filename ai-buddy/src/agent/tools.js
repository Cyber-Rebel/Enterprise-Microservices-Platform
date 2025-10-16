const {tool} = require('@langchain/core/tools')
const {z} = require('zod');
const axios = require('axios');
//https://js.langchain.com/docs/integrations/platforms/google/
// Search Product API tool 

const SearchProduct  = tool(async (query,token)=>{
    const response = await axios.get(`http://localhost:3001/api/products?q=${data.query}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }

    
    });
    return JSON.stringify(response.data);

},{
    name:'SearchProduct',
    description:'useful for when you need to search for products on google shopping. input should be a search query.',
schema:z.object({
        query:z.string().describe('The search query for products')
    })
})



const addProductToCart = tool(async ({productId, qty=1, token})=>{
    const response = await axios.post(`http://localhost:3002/api/carts/items`,{
        productId,
        qty
    },{
        headers:{
            Authorization:`Bearer ${token}`
        }
         
    
    });
    // return JSON.stringify(response.data);
    // return 'Product added to cart successfully';
    return `Added product ${productId} with quantity ${qty} to cart successfully`;

},{
    name:'addProductToCart',
    description:'useful for when you need to add a product to cart. input should be a json object with productId and quantity.',
    schemax:z.object({
        productId:z.string().describe('The id of the product to add to cart'),
        qty:z.number().describe('The quantity of the product to add to cart').default(1)

    })
})
module.exports = {SearchProduct, addProductToCart};