import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Lsiting</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' className='border  p-3 rounded-lg ' id='name' maxLength='62' minLength='10' required/>
            <textarea type="text" placeholder='Description' className='border  p-3 rounded-lg ' id='description'  required/>
            <input type="text" placeholder='Address' className='border  p-3 rounded-lg ' id='address'  required/>
            <div className='flex gap-6 flex-wrap'>

               <div className='flex gap-2'>
                <input type="checkbox" className='w-5 ' id='sale'  />
                <span>Sell</span>
                </div> 
               <div className='flex gap-2'>
                <input type="checkbox" className='w-5 ' id='rent'  />
                <span>Rent</span>
                </div> 
               <div className='flex gap-2'>
                <input type="checkbox" className='w-5 ' id='parking'  />
                <span>Parking Spot</span>
                </div> 
               <div className='flex gap-2'>
                <input type="checkbox" className='w-5 ' id='furnished'  />
                <span>Furnished</span>
                </div> 
               <div className='flex gap-2'>
                <input type="checkbox" className='w-5 ' id='offer'  />
                <span>Offer</span>
                </div> 

            </div>

            <div className='flex flex-wrap gap-6 '>

                <div className='flex items-center gap-2'>
                    <input type="number"  className='border border-gray-300 p-3 rounded-lg ' id='bedrooms' min='1' max='10'  required/>
                    <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input type="number"  className='border border-gray-300 p-3 rounded-lg ' id='bathrooms' min='1' max='10'   required/>
                    <p>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input type="number"  className='border border-gray-300 p-3 rounded-lg ' id='regularPrice'  required/>
                    <div className="flex flex-col items-center">
                        <p>Regural Price</p>
                        <span className='text-xs'>(Rs/Month)</span>
                    </div>
                    
                </div>
                <div className='flex items-center gap-2'>
                    <input type="number"  className='border border-gray-300 p-3 rounded-lg ' id='discountedPrice'  required/>
                    <div className="flex flex-col items-center">
                        <p>Discounted Price</p>
                        <span className='text-xs'flex flex-col items-center>(Rs/Month)</span>
                    </div>
                    
                </div>

            </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
            <p className='font-semibold'>Images:
            <span className='font normal text-gray-600 ml-2'>The first image will be the coverf  (max 6)</span>
            </p>
            <div className="flex gap-4">
                <input type="file" className='border border-gray-300 p-3 rounded w-full ' id='images' multiple accept='image/*'/>
                <button className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>UPLOAD</button>
                
            </div>

            <button className="p-3 bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-white">Create List</button>

        </div>
        

      </form>
    </main>
  )
}
