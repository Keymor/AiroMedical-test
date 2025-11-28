'use client'
import { useEffect, useRef, useState } from "react"
import { useBrewerisList } from "./store/breweries"
import LoadingComp from "./loadingComp"
import Link from "next/link"

export default function Home() {
  const [startIndex, setStartIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const { list, fetchNextPage, pageCounter, removeItems } = useBrewerisList()

  const listRef = useRef(null)

  const handleSelected = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()

    setSelected((s) => {
      const isSelected = s.includes(index)

      if (isSelected) {
        return s.filter((item) => item !== index)

      } else {
        return [...s, index]
      }
    })
  }

  const handleRemove = () => {
    removeItems(selected)
    setSelected([])
  }

  const handleScroll = () => {
    const element = listRef.current

    if (element) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = element

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        pageCounter()
        fetchNextPage()
      }
    }
  }

  useEffect(() => {
    fetchNextPage()
  }, [])

  return (
    <>
      <div className='flex flex-col w-full h-screen'>
        <div className="flex mt-auto">
          <button
            onClick={handleRemove}
            style={{ visibility: selected.length >= 1 ? 'visible' : 'hidden' }}
            className='bg-red-600 p-4 mx-auto mb-2 rounded-lg cursor-pointer'>
            DELETE
          </button>
        </div>
        <div
          ref={listRef}
          onScroll={handleScroll}
          className='mx-auto mb-auto max-h-140 bg-gray-800 p-10 rounded-2xl text-center overflow-y-scroll flex flex-col gap-10'>
          {list.map((item, index) => (
            <Link 
            key={index}
            href={item.website_url || '/'}>
              <p
                style={{ backgroundColor: selected.includes(index) ? '#8f8f8f' : '' }}
                onContextMenu={(event) => handleSelected(event, index)}
                className='bg-gray-900 p-5 rounded-lg cursor-pointer'>{item.name}</p>
            </Link>
          ))}
          <LoadingComp />
        </div>
      </div>
    </>
  )
}
