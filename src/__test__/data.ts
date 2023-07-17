import { ShopItemResource, ShopperResource } from "../Resources";

export const shopper: ShopperResource = {
    shopLists: [
        {
            id: "123456",
            store: "Store 1",
            public: true,
            done: false,
            creator: "1",
            creatorName: "Creator 1",
            createdAt: "01.05.2023",
            shopItemCount: 1
        },
        {
            id: "987654",
            store: "Store 2",
            public: true,
            done: false,
            creator: "2",
            creatorName: "Creator 2",
            createdAt: "02.05.2023",
            shopItemCount: 2
        }
    ]
}

export const shopItems1: ShopItemResource[] = [
    {
        id: "51",
        name: "Item 1",
        quantity: "1",
        remarks: "Remarks 1",
        creator: "1",
        creatorName: "Creator 1",
        createdAt: "01.05.2023",
        shopList: "1",
        shopListStore: "Store 1"
    },
    {
        id: "52",
        name: "Item 2",
        quantity: "2",
        remarks: "Remarks 2",
        creator: "2",
        creatorName: "Creator 2",
        createdAt: "02.05.2023",
        shopList: "2",
        shopListStore: "Store 1"
    }
];

export const shopItems2: ShopItemResource[] = [
    {
        id: "73",
        name: "Item 3",
        quantity: "3",
        remarks: "Remarks 3",
        creator: "1",
        creatorName: "Creator 1",
        createdAt: "01.05.2023",
        shopList: "1",
        shopListStore: "Store 2"
    }
];
