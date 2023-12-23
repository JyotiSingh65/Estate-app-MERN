import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-wrap md:flex-row'> 
      <div className="p-7 border-b-2 sm:border-r-2 sm:min-h-screen">
        <form className='flex flex-col gap-8'>
            <div className=" flex  items-center gap-2 ">
                <label htmlFor="" className="whitespace-nowrap font-semibold">Search Term</label>
                <input type="text" className="border rounded-lg p-3 w-full" id='searchTerm' placeholder='search' />

            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <lable className='font-semibold' >Type:</lable>
                <div className="flex gap-2">
                    <input type="checkbox" id='all' className='w-5' />
                    <span>Rent & Sale</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='rent' className='w-5' />
                    <span>Rent</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='sale' className='w-5' />
                    <span>Sale</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='offer' className='w-5' />
                    <span>Offer</span>
                    
                </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <lable className='font-semibold'>Amenities:</lable>
                <div className="flex gap-2">
                    <input type="checkbox" id='parking' className='w-5' />
                    <span>Parking</span>
                    
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='furnished' className='w-5' />
                    <span>Furnished</span>
                    
                </div>
                
            </div>
            <div className="flex items-center gap-2">
                <lable className='font-semibold'>Sort By:</lable>
                <select id='sort_order ' className='border rounded-lg p-3'>
                    <option value="">Price High to Low</option>
                    <option value="">Price Low to High</option>
                    <option value="">Latest</option>
                    <option value="">Oldest</option>
                </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div className="">
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results</h1>
      </div>
    </div>
  )
}
