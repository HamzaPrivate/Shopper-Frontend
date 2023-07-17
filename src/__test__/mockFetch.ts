import { shopItems1, shopItems2, shopper } from "./data";

const MOCK_FETCH_DELAY = Number.parseInt(process.env.MOCK_FETCH_DELAY || "0");

/**
 * Ersetzt fetch() durch eine Mock-Funktion, die die Daten aus data.ts zurückliefert.
 * Rufen Sie diese Funktion in Ihren jeweiligen Tests.
 */
export default function mockFetch() {
    jest.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
        let data: any
        const url = input.toString();

        function api_shopper() {
            const shopperMatch = url.match(/\/api\/shopper/i);
            if (shopperMatch) {
                return shopper;
            }
            return undefined;
        }
        function api_shopItems() {
            const shopListMatch = url.match(/\/api\/shoplist\/(\d+)\/shopitems/i);
            if (shopListMatch) {
                const shopListId = shopListMatch[1];
                switch (shopListId) {
                    case "123456": return { shopItems: shopItems1 };
                    case "987654": return { shopItems: shopItems2 };
                    default: return "Not found"
                }
            }
            return undefined;
        }
        function api_shopList() {
            const shopListMatch = url.match(/\/api\/shoplist\/(\d+)/i);
            if (shopListMatch) {
                const shopListId = shopListMatch[1];
                const data = shopper.shopLists.find(shopList => shopList.id == shopListId)
                return data ?? "Not found";
            }
            return undefined;
        }
        function api_shopItem() {
            const shopItemMatch = url.match(/\/api\/shopitem\/(\d+)/i);
            if (shopItemMatch) {
                const shopItemId = shopItemMatch[1];
                if (shopItemMatch[1].startsWith("5")) {
                    return shopItems1.find(shopItem => shopItem.id === shopItemId);
                } if (shopItemMatch[1].startsWith("7")) {
                    return shopItems2.find(shopItem => shopItem.id === shopItemId);
                } else {
                    return "Not found";
                }
            }
            return undefined;
        }

        function api_login() {
            const loginMatch = url.match(/\/api\/login/i);
            if (loginMatch) {
                const body = init?.body;
                if (body) {
                    const { email, password } = JSON.parse(body.toString());
                    if (email === "john@some-host.de" && password === "12abcAB!") {
                        return { // JWT ist abgelaufen, aber das macht hier nichts
                            access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDliMGM4YjJlMzQ4NmJjMTk2Zjk4ZDYiLCJyb2xlIjoiYSIsImlhdCI6MTY4Nzg4NDg3MCwiZXhwIjoxNjg3ODg1MTcwfQ.CNuyfRoA7cEM9SXYgXrlAm0uqbu7aDo8xwEQWqXvW6Q",
                            token_type: "Bearer"
                        }
                    }
                }
            }
            return undefined;
        }


        data = api_shopper() || api_shopItems() || api_shopList() || api_shopItem() || api_login();
        const resp: any /* Response */ = {
            headers: new Headers(),
            ok: false,
            status: 500,
            statusText: "Internal server error",
            type: "basic",
            url: url,
            clone: () => resp,
            redirected: false,
            body: null,
            bodyUsed: false,
        }
        switch (typeof data) {
            case 'object':
                resp.headers.set("Content-Type", "application/json");
                resp.status = 200;
                resp.ok = true;
                resp.json = () => Promise.resolve(data);
                break;
            case 'string':
                resp.status = 404;
                resp.ok = false;
                resp.headers.set("Content-Type", "text/html");
                resp.text = () => Promise.resolve("<html><body><h1>Not found</h1></body></html>");
                break;
            default:
                resp.status = 400;
                resp.ok = false;
                resp.headers.set("Content-Type", "application/json");
                resp.json = () => Promise.resolve({ errors: [{ msg: "Validation error", param: "someID", location: "params", value: "someValue" }] });
        }
        await new Promise(resolve => setTimeout(resolve, MOCK_FETCH_DELAY))
        return Promise.resolve(resp);
    });
}