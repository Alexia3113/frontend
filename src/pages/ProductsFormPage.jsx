import { useForm, Controller } from "react-hook-form";
import { useProducts } from "../context/ProductContext";
import uploadIcon from '../assets/addphoto.svg';
import { useState,useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoBagAdd, IoCloseSharp } from "react-icons/io5";

function ProductsFormPage() {
    const server = 'http://localhost:4000/img/'
    const {register,handleSubmit, control, setValue, formState:{errors}} = useForm({
        defaultValues:{
            name:'',
            price: 0.0,
            year: new Date().getFullYear(),
            image:uploadIcon
        }
    });
    const {createProduct, getProduct, updateProductNoUpdateImage, updateProduct,
        errors:productErrors
    } = useProducts();
    const [selectedImage, setSelectedImage] = useState(uploadIcon);
    const inputImage = useRef(null);
    const navigate = useNavigate();
    const params = useParams();
    const [updateImage, setUpdateImage] = useState(false);

    useEffect( ()=>{
        async function loadProduct(){
            console.log(params)
            if(params.id){//si existe en los params un id
                //obtenemos los datos del producto
                const product = await getProduct(params.id);
                console.log(product);
                setValue('name', product.name);
                setValue('price', product.price);
                setValue('year', product.year);
                setValue('image', product.image);
                setSelectedImage(server+product.image);
            }
        }//fin de loadProduct
        loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = handleSubmit((data)=>{
         const formData = new FormData();

        //Agregar datos al FormData
        formData.append('name',data.name); //nombre del producto
        formData.append('price',data.price); //precio del producto
        formData.append('year',data.year); //año del producto
        formData.append('image',data.image); //imagen del producto

        if(data.image == "/src/assets/addphoto.svg"){
            //no se ha elegido imagen
            productErrors.push("No se ha elegido una imagen");
            return
        }

        if(params.id){//si hay un parametro en la url Actualiza
            if(!updateImage){//si no se cambio la imagen actualiza sin imagen
                const updateData = {
                    "name": data.name,
                    "price": data.price.toString(),
                    "year": data.year.toString(),
                    "image": data.image
                }
                updateProductNoUpdateImage(params.id,updateData)
            }else {//se cambia la imagen, se actualiza el producto y se actualiza la imagen en el backend eliminando la anterior
                updateProduct(params.id, formData);
            }
        }else{//se va crear un nuevo producto
            createProduct(formData);
        }       
        navigate('/products');
    });//fin de onSubmit

    const handleImageClick = (()=>{
        inputImage.current.click();
    })//fin de handleImageClick

    const handleImageChange = (e, field) =>{
        const file = e.target.files[0];
        console.log(file)
        setSelectedImage(file? URL.createObjectURL(file):uploadIcon);
        field.onChange(file);
        setUpdateImage(true);
    }//fin de handleImageChange

    return(
        <div className="flex items-center justify-center h-screen">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
            <h1 className='text-3xl font-bold'>Productos</h1>
            {
                productErrors?.map((error, i) =>(
                    <div className='text-red-500 p-2 my-2' key={i}>
                        {error}
                    </div>
                ))
            }
                <form onSubmit={onSubmit}>
                    <label htmlFor='name'>Nombre</label>
                    <input type="text" id="name"
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Nombre del producto'
                        {
                            ...register("name",{required: true})
                        }
                        autoFocus
                    />
                    { errors.name && ( 
                        <div className='text-red-500'>Nombre del producto es requerido</div>
                    )}
                    <label htmlFor='price'>Precio</label>
                    <input type="number" step="0.10" id="price"
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Precio del producto'
                        {
                            ...register("price",{
                                required: true,
                                min:0.0,
                                valueAsNumber:true,
                            })
                        }
                    />
                    {
                        errors.price &&(
                            <div className='text-red-500'>El precio del producto es requerido</div>
                    )}
                    {errors.price?.type ==="min" &&(
                        <div className='text-red-500'>El precio mínimo es 0</div>
                    )}
                    <label htmlFor='year'>Año</label>
                    <input type="number" max={new Date().getFullYear()} min="1900" step="1"
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Año del producto'
                        {
                            ...register("year",{
                                valueAsNumber: true,
                            })
                        }
                    />
                    { errors.year && (
                        <div className='text-red-500'>Año del producto es requerido</div>
                    )}
                    {errors.year?.type === "min" && (
                        <div className='text-red-500'>El año minimo es 1900</div>
                    )}
                    {errors.year?.type ==="max" && (
                        <div className='text-red-500'>El año maximo es {new Date().getFullYear()}</div>
                    )}
                    <div className='py-2 my-2'>
                        {
                            selectedImage &&(
                                <img 
                                    src={selectedImage}
                                    alt="Imagen Seleccionada"
                                    width={200}
                                    height={200}
                                    className="max-h[200px] object-contain"
                                    onClick={handleImageClick}
                                />
                            )
                        }
                        <Controller 
                            name="image"
                            control={control}
                            render={({field}) =>(
                                <input 
                                    type="file"
                                    ref={inputImage}
                                    onChange={(e)=> handleImageChange(e, field)}
                                    className='hidden'
                                />
                            )} 
                        />
                    </div> 
                    <button className="bg-green-300 hover:bg-green-500
                            text-white font-semibold hover:text-white
                            py-2 px-4 border border-zinc-500
                            hover:border-transparent rounded" >
                        <IoBagAdd size={30} />
                    </button> 
                    <button className="bg-red-300 ml-4
                            text-white font-semibold hover:bg-red-700
                            py-2 px-4 border border-zinc-500
                            hover:border-transparent rounded"
                            onClick={()=>{navigate('/products')}}>
                        <IoCloseSharp size={30} />
                    </button>     
                </form>
            </div>
        </div>
    )
}
export default ProductsFormPage