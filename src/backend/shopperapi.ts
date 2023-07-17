import { retrieveJWT } from "../JWTManager";
import { LoginResource, ShopItemResource, ShopListItemsResource, ShopListResource, ShopperResource } from "../Resources";
import { fetchWithErrorHandling } from "./validation";
const HOST = process.env.REACT_APP_API_SERVER_URL;

/**
 * Ergänzen Sie hier die Anbindung an den Server
 */

function headers() {
    const headers: any = {
        "Content-Type": "application/json"
    }
    const jwt = retrieveJWT();
    if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
    }
    return headers;
}


export async function getShopper(): Promise<ShopperResource> {
    const url = `${HOST}/api/shopper`;
        const response = await fetchWithErrorHandling<ShopperResource>(url!, {headers: headers()});
        return response;
}

export async function getShopItems(shopListId: string): Promise<ShopItemResource[]> {
    const url = `${HOST}/api/shoplist/${shopListId}/shopitems`;
        const shopListItemsResource: ShopListItemsResource = await fetchWithErrorHandling(url!, {headers: headers()});
        return shopListItemsResource.shopItems;
}

export async function getShopList(shopListID: string): Promise<ShopListResource> {
    const url = `${HOST}/api/shoplist/${shopListID}/`;
        const response = await fetchWithErrorHandling<ShopListResource>(url!, {headers: headers()});
        return response;
}

export async function getShopItem(shopItemID: string): Promise<ShopItemResource> {
    const url = `${HOST}/api/shopitem/${shopItemID}/`;
        const response = await fetchWithErrorHandling<ShopItemResource>(url!, {headers: headers()});
        return response;
}

export async function login(email: string, password: string): Promise<string> {
    const url = `${HOST}/api/login`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const loginResource: LoginResource = await response.json();
            return loginResource.access_token;
        }
        if (response.status === 401) {
            throw new Error("Invalid credentials");
        }
        throw new Error(`Error connecting to ${HOST}: ${response.statusText}`);
    } catch (error) {
        throw error;
    }


}