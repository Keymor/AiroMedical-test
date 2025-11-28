import { create } from 'zustand'

interface SingleBrewerie {
    name: string
    website_url: string
    location: string
}

interface StoreLisst {
    list: SingleBrewerie[]
    fetchNextPage: () => Promise<void>
    pageCounter: () => void
    removeItems: (indexToRemove: number[]) => void
    loading: boolean
    isFirstFetch: boolean
    page: number
}

export const useBrewerisList = create<StoreLisst>((set, get) => ({
    list: [],
    fetchNextPage: async () => {
        try {
            const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?per_page=15&page=${get().page}`)
            const data: SingleBrewerie[] = await response.json()

            if (get().isFirstFetch) {
                set({
                    list: data
                })
                set({
                    isFirstFetch: false
                })
            } else {
                set({
                    list: [...get().list, ...data]
                })
            }

        } catch (err) {
            console.log(err)
        }
    },
    pageCounter: () => {
        set({
            page: get().page + 1
        })
    },
    removeItems: (indexToRemove) => {
        set((state) => {
            const newList = state.list.filter((_, index) => {
                return !indexToRemove.includes(index)
            })

            if (newList.length <= 5) {
                get().pageCounter()
                get().fetchNextPage()
            }
            return { list: newList }
        })
    },
    loading: false,
    isFirstFetch: true,
    page: 1
}))