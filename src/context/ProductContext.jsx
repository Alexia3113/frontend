import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { createProductRequest, getProductsRequest, deleteProductRequest,getProductRequest,
    updateProductRequestNoUpdateImage, updateProductRequest
 } from "../api/products";

const ProductContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () =>{
    const context = useContext(ProductContext)

    if(!context){
        throw new Error('UseProduct debe estar definido en un contexto');
    }
    return context;
}//fin de useProducts

export function ProductsProvider( {children}){
    const [products,setProducts] = useState([]);
    const [errors, setErrors] = useState([]);

    //Funcion para crear un producto
    const createProduct = async (product) =>{
        try {
            console.log(product)
            await createProductRequest(product);
            getProducts();
        // eslint-disable-next-line no-empty
        } catch (error) {
            setErrors(error.response.data.message);
            console.log(error);
        }    
    }//fin de createProduct

    //funcion para obtener todos los productos de la base de datos
    const getProducts = async () =>{
        try {
            const res = await getProductsRequest();
            //asignamos la respuesta del backend al arreglo de productos
            setProducts(res.data);
        } catch (error) {
            setErrors(errors.response.data.message)
            console.log(error);
        }        
    }//fin de getProducts

    //funcion para eliminar un producto de la base de datps
    const deleteProduct = async (id)=>{
        try {
            const res = await deleteProductRequest(id);
            //console.log(res.data);
            if(res.status ==200){
                setProducts(products.filter(product => product._id != id))
            }
        } catch (error) {
            setErrors(error.response.data.message);
            console.log(error)
        }
    }//fin de deleteProduct

    //funcion para obtener un  producto por id de la base de datos
    const getProduct = async(id)=>{
        try {
            const res = await getProductRequest(id);
            //console.log(res);
            return res.data
        } catch (error) {
            setErrors(error.response.data.message);
            console.log(error)
        }
    }//fin de getProduct

    //funcion para actualizar un producto SIN CAMBIAR LA IMAGEN
    const updateProductNoUpdateImage = async(id,product) =>{
        try {
            const res = await updateProductRequestNoUpdateImage(id, product)
            console.log(res);
        } catch (error) {
            setErrors(error.response.data.message);
            console.log(error)
        }
    }//fin de updateProductNoUpdateImage

    //funcion para actualizar un producto CON CAMBIO DE IMAGEN
    const updateProduct = async (id, product)=>{
        try {
            const res = await updateProductRequest(id,product)
            console.log(res);
        } catch (error) {
            setErrors(error.response.data.message);
            console.log(error)          
        }
    }//fin de updateProduct

    return(
        <ProductContext.Provider value={{
            products,
            createProduct,
            getProducts,
            deleteProduct,
            getProduct,
            updateProductNoUpdateImage,
            updateProduct,
            errors
        }}>
            {children}
        </ProductContext.Provider>
    )
}//fin de ProductsProvider
ProductsProvider.propTypes = {
    children: PropTypes.any
}