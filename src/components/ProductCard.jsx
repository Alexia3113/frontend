import PropTypes from "prop-types";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { IoTrashBinSharp, IoPencilSharp } from "react-icons/io5";

function ProductCard({product}) {
    const {deleteProduct} = useProducts();

    const server = import.meta.env.VITE_BASE_URL+'/img/'
    return (
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-sm">
            <header className="flex justify-between">
                <h1 className="text-1xl font-bold">{product.name}</h1>
            </header>
            <div className="flex gap-x-2 justify-end">
                    <button  className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm'
                        onClick={ ()=>{
                            //console.log(product._id)
                            deleteProduct(product._id)
                        }}>
                            <IoTrashBinSharp />
                    </button>
                    <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm'>
                        <Link to={'/product/'+product._id}>
                            <IoPencilSharp />
                        </Link>
                    </button>
            </div>
            <div className="flex justify-center">
                <img 
                    src={server+product.image}
                    alt="Imagen Seleccionada"
                    width={200}
                    height={200}
                    className="max-h[200px] object-contain flex my-2 py-2"
                />
            </div>
            <div className="flex">
                <p className="text-slate-300 my-2 ">
                    <span>Precio:</span> {product.price}
                </p>
            </div>
            <div className="flex">
                <p className="text-slate-300 my-2 ">
                    <span>Año:</span>{product.year}
                </p>
            </div>
        </div>
    )  
}//fin de ProductCard

export default ProductCard

ProductCard.propTypes={
    product: PropTypes.any
}