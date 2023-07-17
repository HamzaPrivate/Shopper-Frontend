import { Link, useParams } from "react-router-dom";
import { ShopItemResource, ShopListResource } from "../Resources";
import React from "react";
import { useErrorBoundary } from "react-error-boundary";
import ShopListDescription from "./ShopListDescription";
import { getShopItems, getShopList } from "../backend/shopperapi";
import LoadingIndicator from "./LoadingIndicator";
import { Table } from "react-bootstrap";
import '../styles/PageShopper.css';

export default function PageShopList() {
    const { showBoundary } = useErrorBoundary();
    const params = useParams();
    const shoplistID = params.shoplistID!;
    const [shopItems, setShopItems] = React.useState<ShopItemResource[] | null>();
    const [shopList, setShopList] = React.useState<ShopListResource | null>();
    async function loadElements() {
        try {
            const shopList: ShopListResource = await getShopList(shoplistID);
            const shopItems: ShopItemResource[] = await getShopItems(shoplistID);
            setShopList(shopList);
            setShopItems(shopItems);
        } catch (error) {
            setShopItems(null);
            setShopList(null);
            showBoundary(error)
        }
    }

    React.useEffect(() => {
        loadElements();
    }, []);


    if (!shopList) {
        return <LoadingIndicator />;
    }

    if (!shopItems) {
        return <LoadingIndicator />;
    }
    const shopItemsList = shopItems? shopItems.map((si) => (
        <tr key={si.id}>
            <td>{si.name}</td>
            <td>{si.quantity}</td>
            <td>{si.creatorName}</td>
            <td>{si.createdAt}</td>
            <td>{si.shopListStore}</td>
            <td>{si.remarks? si.remarks: "no remarks"}</td>
            <Link to={`/shopitem/${si.id}`} className="view-link">View Shopitem</Link>
        </tr>
    )) : null;
    return (
        <>
            <h1>{shopList.store} by {shopList.creatorName}</h1>
            <Table striped hover className="shopper-table" style={{width: "48%"}}>
                <thead>
                    <tr>
                        <th>Store</th>
                        <th>Creator</th>
                        <th>Created at</th>
                        <th>Public</th>
                        <th>Done</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    <ShopListDescription shopList={shopList}></ShopListDescription>
                </tbody>
            </Table>
            <h2>Shopitems</h2>
            <Table striped hover className="shopper-table" style={{width: "60%"}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Creator</th>
                        <th>Created at</th>
                        <th>Store</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {shopItemsList}
                </tbody>
            </Table>
        </>

    )
}   