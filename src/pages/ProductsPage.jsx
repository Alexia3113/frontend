import { useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
    const {getProducts, products} = useProducts();

    //ejecutamos la funcion getProducts inmediatamente
    //despues de que se cargue el componente
    useEffect(()=>{
        getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[products])

    if(products.lenght === 0)
        return (<h1>No hay productos para listar</h1>)

    return(
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {
                products.map( (product)=>(
                    <ProductCard product={product}
                                 key={product._id}
                    />
                ))
            }
        </div>
    )
}
export default ProductsPage
