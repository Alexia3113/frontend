import axios from './axios';

//llamada al aip para obtener todos los productos
export const getProductsRequest = () => axios.get('/products');
//llamada al api para obtener un producto por id
export const getProductRequest= (id) => axios.get('/products/'+id);
//llamada al aip para agregar un producto
export const createProductRequest = (product) => axios.post('/products', product,{
    headers:{
        'Content-Type': 'multipart/form-data'
    }
});

//llamada al aip para eliminar un producto
export const deleteProductRequest = (id) => axios.delete('/products/'+id);

//llamada al api para editar un producto
export const updateProductRequest = (id,product) => axios.put('/products/'+id, product ,{
    headers:{
        'Content-Type' : 'multipart/form-data'
    }
});

//llama al api para editar un producto SIN CAMBIAR LA IMAGEN
export const updateProductRequestNoUpdateImage =(id, product) => axios.put('/productupdatenoimage/'+id, product);